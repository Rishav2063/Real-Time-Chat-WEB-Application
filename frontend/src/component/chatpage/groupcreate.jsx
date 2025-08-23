import './chatpage.css';

import { IoMdSearch } from "react-icons/io";
function Groupcreate(){
    return(<>
   
      <div className='search-div-chatpage'>
        <input className='search-chatpage' type="text" />
        <button className='btn-chatpage-search'><IoMdSearch className='search-img-chatpage' /></button>    
              </div>
     <div className='chat-div'>
       <label htmlFor="">
        <input type="checkbox" name="Person Name" id="" />
        Person Name
       </label>
      
      </div>
     <form className="chating" style={{marginTop:"10px", height:"40px" }}>
               <input 
               className="chatin"
                 type="text" 
                 name="groupname" 
                 id="send"

                 placeholder="enter Group Name"
               />
               <button type="submit" className="chatbtn">Create Group</button>
             </form>
    </>
    )
}
export default Groupcreate;