#!/usr/bin/env python3
import sys
import termios
import tty
import random
import signal
import os

class WordBlankingGame:
    def __init__(self):
        # Game state
        self.words = []
        self.blanked_indices = []
        self.available_indices = []
        self.last_recovered = None
        self.can_recover = True
        
        # Set up signal handler for clean exit
        signal.signal(signal.SIGINT, self.handle_exit)
    
    def get_key(self):
        """Get a single keypress from the user without requiring Enter."""
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(sys.stdin.fileno())
            ch = sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        return ch
    
    def clear_screen(self):
        """Clear the terminal screen in a platform-independent way."""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def get_input_text(self):
        """Get the initial text from user."""
        print("Enter the text you want to blank out (press Enter when done):")
        user_text = input().strip()
        
        # Ensure we have text to work with
        while not user_text:
            print("Error: No text entered. Please try again:")
            user_text = input().strip()
            
        return user_text
    
    def print_instructions(self):
        """Print game instructions."""
        print("\n=== WORD BLANKING GAME ===")
        print("Press SPACE to blank out another word.")
        print("Press 'b' to reveal the previously blanked word (can only use once per blank).")
        print("Press 'q' to quit.\n")
    
    def print_status_message(self):
        """Print status messages based on current game state."""
        if not self.blanked_indices:
            print("Status: All words are visible.")
        elif not self.available_indices:
            if self.can_recover:
                print("Status: All words are blanked! Press 'b' to reveal the last word.")
            else:
                print("Status: All words are blanked!")
        elif not self.can_recover:
            print("Status: You've already used 'b'. Blank another word to use it again.")
    
    def display_text(self):
        """Display the current text with appropriate words blanked."""
        display_text = self.words.copy()
        for i in self.blanked_indices:
            word_length = len(self.words[i])
            display_text[i] = " " * word_length
        
        print("\n" + " ".join(display_text) + "\n")
    
    def blank_word(self):
        """Blank out a word and update game state."""
        if not self.available_indices:
            return False
            
        # Determine which word to blank
        if self.last_recovered is not None:
            index_to_blank = self.last_recovered
            self.last_recovered = None
        else:
            index_to_blank = random.choice(self.available_indices)
        
        # Update game state
        self.available_indices.remove(index_to_blank)
        self.blanked_indices.append(index_to_blank)
        self.can_recover = True
        return True
    
    def recover_word(self):
        """Recover the most recently blanked word if allowed."""
        if not self.blanked_indices or not self.can_recover:
            return False
            
        # Recover most recent word
        last_blanked = self.blanked_indices.pop()
        self.available_indices.append(last_blanked)
        self.last_recovered = last_blanked
        self.can_recover = False
        return True
    
    def handle_exit(self, signum=None, frame=None):
        """Handle program exit gracefully."""
        print("\n\nThank you for playing! Exiting...")
        sys.exit(0)
    
    def run(self):
        """Main game loop."""
        try:
            # Initialize game
            user_text = self.get_input_text()
            self.words = user_text.split()
            self.available_indices = list(range(len(self.words)))
            
            # Display initial text
            self.clear_screen()
            self.print_instructions()
            self.print_status_message()
            self.display_text()
            
            # Main game loop
            while True:
                key = self.get_key()
                
                if key == ' ':  # Space key
                    action_taken = self.blank_word()
                    
                elif key.lower() == 'b':  # 'b' key
                    action_taken = self.recover_word()
                    
                elif key.lower() == 'q':  # 'q' key
                    self.handle_exit()
                else:
                    # Ignore other keys
                    continue
                
                # Update display
                self.clear_screen()
                self.print_instructions()
                self.print_status_message()
                self.display_text()
                
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            return 1
        
        return 0

if __name__ == "__main__":
    game = WordBlankingGame()
    sys.exit(game.run())
