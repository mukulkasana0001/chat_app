import React, { useEffect } from 'react'

function ClearMsg() {

      
    const Clearmsg = ()=>{
            localStorage.setItem("todos", JSON.stringify([]));

             window.location.reload()

    }
  return (
    <button className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 
      rounded-full' onClick={Clearmsg}>
      Clear 💬
      </button>
  )

}
export default ClearMsg
