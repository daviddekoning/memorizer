from django.db import models
from django.contrib.auth.models import User


class Verse(models.Model):
    """Model for storing Bible verses and their memorization state."""
    
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('in_progress', 'In Progress'),
        ('memorized', 'Memorized'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verses')
    reference = models.CharField(max_length=100, help_text='e.g., "John 3:16"')
    translation = models.CharField(max_length=20, help_text='e.g., "ESV", "NIV"')
    text_content = models.TextField(help_text='The actual verse text')
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='upcoming',
        help_text='Current memorization status'
    )
    hidden_indices = models.JSONField(
        default=list,
        blank=True,
        help_text='List of integers representing hidden word indices'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'verses'
    
    def __str__(self):
        return f"{self.reference} ({self.translation}) - {self.status}"

