import React, { useState, useEffect } from 'react'
import useStyles from './styles'
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';
import { useHistory } from 'react-router-dom';

const Form = ({currentId, setCurrentId}) => {
  const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null)
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory()
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    collections:'',
    tags: '',
    selectedFile: ''
  })
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost({...postData, name:user?.result?.name }, history));
    } else {
      dispatch(updatePost(currentId, {...postData, name:user?.result?.name }))
    }
    clear()
  };

  if(!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant='h6' align='center'>
          Sign up to create your own collection
        </Typography>
      </Paper>
    )
  }

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: '', description: '',collections: '', tags: '', selectedFile: '' });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form 
      autoComplete='off' 
      noValidate 
      className={`${classes.root} ${classes.form}`}
      >
        <Typography variant='h6'>{currentId ? 'Edit item' : 'Create item'}</Typography>

        <TextField 
        name='title' 
        variant='outlined' 
        label='Title' 
        fullWidth 
        value={postData.title} 
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}/>

        <TextField 
        name='description' 
        variant='outlined' 
        label='Description' 
        fullWidth 
        value={postData.description} 
        onChange={(e) => setPostData({ ...postData, description: e.target.value })}/>

        <TextField 
        name='collection' 
        variant='outlined' 
        label='Collection' 
        fullWidth 
        value={postData.collections} 
        onChange={(e) => setPostData({ ...postData, collections: e.target.value })}/>

        <TextField 
        name='tags' 
        variant='outlined' 
        label='Tags' 
        fullWidth 
        value={postData.tags} 
        onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}/>

        <div className={classes.fileInput}>
          <FileBase
          type='file'
          multiple={false}
          onDone={({base64}) => setPostData({...postData, selectedFile: base64})}
          />
        </div>

        <Button 
        className={classes.buttonSubmit} 
        variant='contained' 
        color='primary' 
        size='large' 
        type='submit'
        onClick={handleSubmit}
        fullWidth
        >
          Submit
        </Button>

        <Button  
        variant='contained' 
        color='secondary' 
        size='large' 
        type='submit'
        onClick={clear}
        className={classes.buttonSubmit}
        fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  )
}

export default Form