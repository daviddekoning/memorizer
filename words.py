#!/usr/bin/env python3
import sys
import termios
import tty
import random

def get_key():
    """Get a single keypress from the user without requiring Enter."""
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setraw(sys.stdin.fileno())
        ch = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    return ch

def clear_screen():
    """Clear the terminal screen."""
    print("\033[H\033[J", end="")

def main():
    # Get the text from the user
    print("Enter the text you want to blank out (press Enter when done):")
    user_text = input()
    
    # Split the text into words
    words = user_text.split()
    if not words:
        print("No text entered. Exiting.")
        return
    
    # Create a list to track which words have been blanked out
    blanked_indices = []
    available_indices = list(range(len(words)))
    
    # Track if a word has been recovered and is pending to be re-blanked
    last_recovered = None
    
    # Flag to track if we've just used the 'b' key
    can_recover = True
    
    # Clear screen before first display
    clear_screen()
    print("Press SPACE to blank out another word.")
    print("Press 'b' to make the previous blanked word reappear (can use only once).")
    print("Press 'q' to quit.\n")
    print(user_text)
    
    while True:
        key = get_key()
        
        if key == ' ':  # Space key
            if available_indices:
                # If there's a recently recovered word, blank it out first
                if last_recovered is not None:
                    index_to_blank = last_recovered
                    last_recovered = None
                else:
                    # Choose a random word to blank out
                    index_to_blank = random.choice(available_indices)
                
                available_indices.remove(index_to_blank)
                blanked_indices.append(index_to_blank)
                
                # Reset recovery ability after blanking another word
                can_recover = True
                
                # Create a new display with the chosen word blanked out
                clear_screen()
                print("Press SPACE to blank out another word.")
                print("Press 'b' to make the previous blanked word reappear (can use only once).")
                print("Press 'q' to quit.\n")
                
                # Display the text with blanked words
                display_text = words.copy()
                for i in blanked_indices:
                    word_length = len(words[i])
                    display_text[i] = " " * word_length
                
                print(" ".join(display_text))
            else:
                clear_screen()
                print("Press SPACE to blank out another word.")
                print("Press 'b' to make the previous blanked word reappear (can use only once).")
                print("Press 'q' to quit.\n")
                print("All words have been blanked out!", end="")
                if can_recover and blanked_indices:
                    print(" Press 'b' to recover the last word.")
                else:
                    print()
                
                # Display the text with all words blanked
                display_text = [" " * len(word) for word in words]
                print(" ".join(display_text))
                
        elif key.lower() == 'b':  # 'b' key to recover a word
            if blanked_indices and can_recover:
                # Recover the most recently blanked word
                last_blanked = blanked_indices.pop()
                available_indices.append(last_blanked)
                
                # Set this as the last recovered word
                last_recovered = last_blanked
                
                # Disable recovery until another word is blanked
                can_recover = False
                
                # Create a new display with the recovered word
                clear_screen()
                print("Press SPACE to blank out another word.")
                print("Press 'b' to make the previous blanked word reappear (can use only once).")
                print("Press 'q' to quit.\n")
                
                # Display the text with current blanked words
                display_text = words.copy()
                for i in blanked_indices:
                    word_length = len(words[i])
                    display_text[i] = " " * word_length
                
                print(" ".join(display_text))
            else:
                clear_screen()
                print("Press SPACE to blank out another word.")
                print("Press 'b' to make the previous blanked word reappear (can use only once).")
                print("Press 'q' to quit.\n")
                
                if not blanked_indices:
                    print("No words are currently blanked out!")
                elif not can_recover:
                    print("You've already recovered a word. Blank another word first.")
                
                # Display the current text
                display_text = words.copy()
                for i in blanked_indices:
                    word_length = len(words[i])
                    display_text[i] = " " * word_length
                
                print(" ".join(display_text))
                
        elif key.lower() == 'q':
            print("\nExiting program.")
            break

if __name__ == "__main__":
    main()

