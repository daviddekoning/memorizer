from django.contrib import admin
from .models import Verse


@admin.register(Verse)
class VerseAdmin(admin.ModelAdmin):
    """Admin interface for Verse model."""
    list_display = ['reference', 'translation', 'user', 'status', 'created_at']
    list_filter = ['status', 'translation', 'created_at']
    search_fields = ['reference', 'text_content', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Verse Information', {
            'fields': ('user', 'reference', 'translation', 'text_content')
        }),
        ('Memorization Status', {
            'fields': ('status', 'hidden_indices')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

