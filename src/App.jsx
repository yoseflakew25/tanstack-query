import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from './Card';

function App() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
  });

  const [db, setDb] = useState([]);
  const [header, setHeader] = useState("Create a Post");
  const [inputs, setInputs] = useState({
    title: '',
    body: ''
  });
  const [editingId, setEditingId] = useState(null); // Track the ID of the post being edited

  useEffect(() => {
    if (data) {
      setDb(data);
    }
  }, [data]); // Only run this effect when `data` changes

  if (isLoading) return 'Loading...';

  if (error) return `An error has occurred: ${error.message}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Generate a new ID for the new post
    const newId = db.length + 1;
    
    // Create a new post object with the input values
    const newPost = {
      id: newId,
      title: inputs.title,
      body: inputs.body
    };
    
    // Update the db state by adding the new post
    setDb(prevDb => [...prevDb, newPost]);

    // Reset the input fields
    setInputs({
      title: '',
      body: ''
    });

    // Optionally, update the header
    setHeader("Create a Post");
  };

  const handleDelete = (id) => {
    const updatedDb = db.filter(item => item.id !== id);
    setDb(updatedDb);
  };

  const handleEdit = (id) => {
    // Find the post in the db state with the given id
    setHeader("Edit a Post");
    const editedPost = db.find(post => post.id === id);
    if (editedPost) {
      // Set the inputs state with the title and body of the post being edited
      setInputs({
        title: editedPost.title,
        body: editedPost.body
      });
      // Set the editingId state to the id of the post being edited
      setEditingId(id);
    }
  };

  const handleEditSubmit = () => {
    // Find the post in the db state with the editingId
    const editedPostIndex = db.findIndex(post => post.id === editingId);
    if (editedPostIndex !== -1) {
      // Create a copy of the db state
      const updatedDb = [...db];
      // Update the title and body of the edited post
      updatedDb[editedPostIndex].title = inputs.title;
      updatedDb[editedPostIndex].body = inputs.body;
      // Update the db state with the edited post
      setDb(updatedDb);
      // Reset the inputs and editingId state
      setInputs({ title: '', body: '' });
      setEditingId(null);
      setHeader("Create a Post")
    }
  };

  return (
    <>
      <h3 className='text-white font-bold text-center mt-8 text-2xl'>{header}</h3>
      <div className="grid grid-cols-3 gap-2 text-center px-16 my-8">
        <input type="text" placeholder="Title" name="title" value={inputs.title} onChange={handleChange} className="input input-bordered w-full " />
        <input type="text" placeholder="Description" name="body" value={inputs.body} onChange={handleChange} className="input input-bordered w-full " />
        {editingId ? (
          <button onClick={handleEditSubmit} className="text-white px-8 py-3 bg-blue-500 rounded-lg">Save Edit</button>
        ) : (
          <button onClick={handleSubmit} className="text-white px-8 py-3 bg-green-500 rounded-lg">Add</button>
        )}
      </div>

      <h3 className='text-white font-bold text-center mt-8 text-xl'>Showing {db.length} results</h3>
      <div className='grid grid-cols-3 mx-16 mt-8 justify-items-center gap-4'>
  {db.slice().sort((a, b) => b.id - a.id).map((post) => ( // Sort db array in descending order based on post ID
    <Card key={post.id} post={post} handleDelete={handleDelete} handleEdit={handleEdit} />
  ))}
</div>

    </>
  );
}

export default App;
