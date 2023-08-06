
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import {signOut} from 'firebase/auth'
import { auth } from "../firebase";
import Plans from './Plans'
import { useNavigate } from 'react-router-dom';
function ProfileScreen() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const goToLogin = () => navigate("/");
    
  return (
    <div className='h-screen bg-blue-600 relative'>

        {/* Logout the user using firebase authentication and than dispatch Logout action to redux store to make user state as null */}
        <button 
              onClick={()=>{
                signOut(auth)
                .then(()=>{
                    // sign-out successful
                    // once signout is successfull than the onAuthStateChange if say user is signed out and it will than dispatch the logout action that we had making user as null
                   goToLogin();
                })
                .catch(error=>{
                    alert(error.message);
                })
              }}
              className='p-2 mt-3 text-white bg-[#e50914] cursor-pointer font-semibold absolute top-0 right-0'>SignOut</button>
       <div className='flex-col w-2/6 ml-auto mr-auto pt-[8%]'>
      
        <div className='bg-white  flex rounded-lg'>

            <div className='ml-[25px] w-full'>
             {(user && user?.currSubscription) && <h3>Currently subscribed to {user?.currSubscription} plan</h3>}
              {(!user || !user?.currSubscription) && <h3>Plans</h3>}
             <h2>{user?.email}</h2>
             <div className='mt-[20px] w-full'>
 

              <Plans/>
                
              
             </div>

            </div>
        </div>
       </div>

    </div>
  )
}

export default ProfileScreen