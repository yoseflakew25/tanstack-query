import React from 'react'

const Card = ({post,handleDelete,handleEdit}) => {
 
  return (
    <div className="card bg-base-100 shadow-xl border border-yellow-500 w-full">
    <div className="card-body">
      <h2 className="font-bold text-2xl text-white" >{post.title}</h2>
      <p>{post.body}</p>
    
     
      <div className="flex gap-2 text-center">

      <button className="text-white px-8 py-3 bg-green-500 rounded-lg" onClick={() => handleEdit(post.id)}>Edit</button>

       
        <button className="text-white px-8 py-2 bg-red-500 rounded-lg" onClick={() => handleDelete(post.id)}>Delete</button>
      </div>
      </div>
    </div>
 
  )
}

export default Card
