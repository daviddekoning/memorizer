from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Verse
from .serializers import VerseSerializer


class VerseModelTest(TestCase):
    """Test cases for the Verse model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_create_verse(self):
        """Test creating a verse with all fields."""
        verse = Verse.objects.create(
            user=self.user,
            reference='John 3:16',
            translation='ESV',
            text_content='For God so loved the world...',
            status='upcoming'
        )
        self.assertEqual(verse.user, self.user)
        self.assertEqual(verse.reference, 'John 3:16')
        self.assertEqual(verse.translation, 'ESV')
        self.assertEqual(verse.status, 'upcoming')
        self.assertEqual(verse.hidden_indices, [])
        
    def test_verse_default_status(self):
        """Test that verse defaults to 'upcoming' status."""
        verse = Verse.objects.create(
            user=self.user,
            reference='Psalm 23:1',
            translation='NIV',
            text_content='The Lord is my shepherd...'
        )
        self.assertEqual(verse.status, 'upcoming')
        
    def test_verse_str_representation(self):
        """Test the string representation of a verse."""
        verse = Verse.objects.create(
            user=self.user,
            reference='Romans 8:28',
            translation='ESV',
            text_content='And we know that...'
        )
        expected_str = 'Romans 8:28 (ESV) - upcoming'
        self.assertEqual(str(verse), expected_str)
        
    def test_verse_ordering(self):
        """Test that verses are ordered by creation date (newest first)."""
        verse1 = Verse.objects.create(
            user=self.user,
            reference='John 1:1',
            translation='ESV',
            text_content='In the beginning...'
        )
        verse2 = Verse.objects.create(
            user=self.user,
            reference='John 1:2',
            translation='ESV',
            text_content='He was in the beginning...'
        )
        verses = Verse.objects.all()
        self.assertEqual(verses[0], verse2)
        self.assertEqual(verses[1], verse1)


class VerseSerializerTest(TestCase):
    """Test cases for the Verse serializer."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_valid_serializer(self):
        """Test serializer with valid data."""
        data = {
            'reference': 'John 3:16',
            'translation': 'ESV',
            'text_content': 'For God so loved the world...',
            'status': 'upcoming',
            'hidden_indices': [0, 2, 5]
        }
        serializer = VerseSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
    def test_hidden_indices_validation_not_list(self):
        """Test that hidden_indices must be a list."""
        verse = Verse.objects.create(
            user=self.user,
            reference='John 3:16',
            translation='ESV',
            text_content='For God so loved the world...'
        )
        serializer = VerseSerializer(verse, data={'hidden_indices': 'not a list'}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('hidden_indices', serializer.errors)
        
    def test_hidden_indices_validation_invalid_items(self):
        """Test that all items in hidden_indices must be integers."""
        verse = Verse.objects.create(
            user=self.user,
            reference='John 3:16',
            translation='ESV',
            text_content='For God so loved the world...'
        )
        serializer = VerseSerializer(verse, data={'hidden_indices': [1, 'two', 3]}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('hidden_indices', serializer.errors)


class VerseAPITest(APITestCase):
    """Test cases for the Verse API endpoints."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        
    def test_list_verses_unauthenticated(self):
        """Test that unauthenticated users cannot list verses."""
        response = self.client.get('/api/verses/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_list_verses_authenticated(self):
        """Test that authenticated users can list their verses."""
        self.client.force_authenticate(user=self.user)
        verse = Verse.objects.create(
            user=self.user,
            reference='John 3:16',
            translation='ESV',
            text_content='For God so loved the world...'
        )
        response = self.client.get('/api/verses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['reference'], 'John 3:16')
        
    def test_user_can_only_see_own_verses(self):
        """Test that users can only see their own verses."""
        self.client.force_authenticate(user=self.user)
        Verse.objects.create(
            user=self.user,
            reference='John 3:16',
            translation='ESV',
            text_content='For God so loved the world...'
        )
        Verse.objects.create(
            user=self.other_user,
            reference='Romans 8:28',
            translation='ESV',
            text_content='And we know that...'
        )
        response = self.client.get('/api/verses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['reference'], 'John 3:16')
        
    def test_create_verse(self):
        """Test creating a verse via API."""
        self.client.force_authenticate(user=self.user)
        data = {
            'reference': 'Psalm 23:1',
            'translation': 'NIV',
            'text_content': 'The Lord is my shepherd...',
            'status': 'upcoming'
        }
        response = self.client.post('/api/verses/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Verse.objects.count(), 1)
        verse = Verse.objects.first()
        self.assertEqual(verse.user, self.user)
        self.assertEqual(verse.reference, 'Psalm 23:1')
        
    def test_update_verse(self):
        """Test updating a verse via API."""
        self.client.force_authenticate(user=self.user)
        verse = Verse.objects.create(
            user=self.user,
            reference='John 3:16',
            translation='ESV',
            text_content='For God so loved the world...'
        )
        data = {'status': 'in_progress', 'hidden_indices': [0, 2, 5]}
        response = self.client.patch(f'/api/verses/{verse.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        verse.refresh_from_db()
        self.assertEqual(verse.status, 'in_progress')
        self.assertEqual(verse.hidden_indices, [0, 2, 5])
        
    def test_delete_verse(self):
        """Test deleting a verse via API."""
        self.client.force_authenticate(user=self.user)
        verse = Verse.objects.create(
            user=self.user,
            reference='John 3:16',
            translation='ESV',
            text_content='For God so loved the world...'
        )
        response = self.client.delete(f'/api/verses/{verse.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Verse.objects.count(), 0)
        
    def test_user_cannot_access_other_users_verse(self):
        """Test that users cannot access verses of other users."""
        self.client.force_authenticate(user=self.user)
        other_verse = Verse.objects.create(
            user=self.other_user,
            reference='Romans 8:28',
            translation='ESV',
            text_content='And we know that...'
        )
        response = self.client.get(f'/api/verses/{other_verse.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

