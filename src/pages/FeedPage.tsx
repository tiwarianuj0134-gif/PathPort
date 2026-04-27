import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, TextField,
  CircularProgress, Alert, IconButton, Chip, Divider,
} from '@mui/material';
import { ThumbUp, Comment, Send, Image, Link as LinkIcon, Delete } from '@mui/icons-material';
import apiClient from '../services/apiClient';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  const [posting, setPosting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const loadFeed = useCallback(async () => {
    try {
      const res = await apiClient.get('/posts/feed');
      setPosts(res.data.posts || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const res = await apiClient.post('/posts', { content: newPost, imageUrl, linkUrl });
      setPosts((prev) => [res.data, ...prev]);
      setNewPost(''); setImageUrl(''); setLinkUrl(''); setShowExtras(false);
      toast.success('Post created!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await apiClient.put(`/posts/${postId}/like`);
      setPosts((prev) => prev.map((p) =>
        p._id === postId
          ? { ...p, likes: res.data.liked ? [...p.likes, user?._id] : p.likes.filter((id: string) => id !== user?._id) }
          : p
      ));
    } catch { /* silent */ }
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    try {
      const res = await apiClient.post(`/posts/${postId}/comments`, { content });
      setPosts((prev) => prev.map((p) => p._id === postId ? { ...p, comments: res.data } : p));
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch { /* silent */ }
  };

  const handleDelete = async (postId: string) => {
    try {
      await apiClient.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Post deleted.');
    } catch { /* silent */ }
  };

  return (
    <Box className="page-enter" sx={{ maxWidth: 680, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Feed</Typography>

      {/* Create post */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
            <Avatar src={user?.avatarUrl} sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.9rem', fontWeight: 700 }}>
              {user?.name?.[0]}
            </Avatar>
            <TextField
              fullWidth multiline maxRows={5}
              placeholder="Share something with your network..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Box>
          {showExtras && (
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
              <TextField size="small" placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} sx={{ flexGrow: 1 }} />
              <TextField size="small" placeholder="Link URL (optional)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} sx={{ flexGrow: 1 }} />
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => setShowExtras((v) => !v)} sx={{ color: showExtras ? '#00d4ff' : 'text.secondary' }}>
                <Image sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => setShowExtras((v) => !v)} sx={{ color: showExtras ? '#00d4ff' : 'text.secondary' }}>
                <LinkIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
            <Button variant="contained" size="small" onClick={handlePost} disabled={posting || !newPost.trim()} endIcon={posting ? <CircularProgress size={14} color="inherit" /> : <Send sx={{ fontSize: 14 }} />}>
              Post
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress sx={{ color: '#1a73e8' }} /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary">No posts yet. Connect with people to see their updates!</Typography>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => {
          const isLiked = post.likes?.includes(user?._id);
          const isOwn = post.userId?._id === user?._id;
          return (
            <Card key={post._id} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                {/* Author */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/profile/${post.userId?._id}`)}>
                    <Avatar src={post.userId?.avatarUrl} sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #1a73e8, #00d4ff)', fontSize: '0.9rem', fontWeight: 700 }}>
                      {post.userId?.name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{post.userId?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{post.userId?.headline}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.disabled">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    {isOwn && (
                      <IconButton size="small" onClick={() => handleDelete(post._id)} sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                        <Delete sx={{ fontSize: 15 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                {/* Content */}
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, mb: 1.5 }}>{post.content}</Typography>

                {post.imageUrl && (
                  <Box component="img" src={post.imageUrl} alt="post" sx={{ width: '100%', borderRadius: 2, mb: 1.5, maxHeight: 300, objectFit: 'cover' }} />
                )}
                {post.linkUrl && (
                  <Box component="a" href={post.linkUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1a73e8', fontSize: '0.8rem', mb: 1.5, '&:hover': { color: '#00d4ff' } }}>
                    <LinkIcon sx={{ fontSize: 14 }} /> {post.linkUrl}
                  </Box>
                )}

                {/* Actions */}
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<ThumbUp sx={{ fontSize: 15 }} />}
                    onClick={() => handleLike(post._id)}
                    sx={{ color: isLiked ? '#1a73e8' : 'text.secondary', fontWeight: isLiked ? 600 : 400, fontSize: '0.78rem' }}
                  >
                    {post.likes?.length || 0} Like{post.likes?.length !== 1 ? 's' : ''}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Comment sx={{ fontSize: 15 }} />}
                    onClick={() => setShowComments((prev) => ({ ...prev, [post._id]: !prev[post._id] }))}
                    sx={{ color: 'text.secondary', fontSize: '0.78rem' }}
                  >
                    {post.comments?.length || 0} Comment{post.comments?.length !== 1 ? 's' : ''}
                  </Button>
                </Box>

                {/* Comments */}
                {showComments[post._id] && (
                  <Box sx={{ mt: 1.5 }}>
                    {post.comments?.map((c: any) => (
                      <Box key={c._id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Avatar src={c.userId?.avatarUrl} sx={{ width: 26, height: 26, background: 'rgba(26,115,232,0.3)', fontSize: '0.7rem' }}>
                          {c.userId?.name?.[0]}
                        </Avatar>
                        <Box sx={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(26,115,232,0.1)', borderRadius: 2, px: 1.5, py: 0.75, flexGrow: 1 }}>
                          <Typography variant="caption" fontWeight={600}>{c.userId?.name}</Typography>
                          <Typography variant="caption" display="block" color="text.secondary">{c.content}</Typography>
                        </Box>
                      </Box>
                    ))}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <TextField
                        size="small" fullWidth
                        placeholder="Write a comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post._id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '0.82rem' } }}
                      />
                      <IconButton size="small" onClick={() => handleComment(post._id)} sx={{ color: '#1a73e8' }}>
                        <Send sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default FeedPage;
