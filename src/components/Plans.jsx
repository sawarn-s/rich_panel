
import { useEffect, useState } from 'react'
import db from '../firebase';
import {collection,getDocs,addDoc,doc,onSnapshot} from "firebase/firestore";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

import {loadStripe} from '@stripe/stripe-js'



function PlanScreen() {
    //storing all the products
    const [products, setProducts] = useState([])
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);

    useEffect(()=>{
      const colRef = collection(db,`customers/${user?.uid}/subscriptions`);
      
      getDocs(colRef)
      .then((querySnapshot)=>{
        querySnapshot.forEach(async (subs) =>{
          
           setSubscription({
            role: subs.data().role,
            current_period_end:subs.data().current_period_end.seconds,
            current_period_start:subs.data().current_period_start.seconds,

           })
        })
      })

    },[user?.uid])// this useEffect is dependent on user.uid since we want this function to be kicked in for every user

    //getting products from db using useEffect

    useEffect(()=>{
      //collection ref
      const colRef = collection(db,'products');



         //get collection docs
        getDocs(colRef)
        .then((querySnapshot) =>{
            // creating empty products
            let productsStripe = [];
           querySnapshot.docs.forEach((productDoc)=>{
            productsStripe[productDoc.id] = productDoc.data();
           })
            

              querySnapshot.forEach(async productDoc => {
                   
                //  const priceSnap = await productDoc.ref.collection('prices').get();
                 const priceRef =  collection(productDoc.ref,"prices");
                 const priceSnap = await getDocs(priceRef);
                  //incase there are multiple prices for the same product
                 priceSnap.docs.forEach(price =>{
                    productsStripe[productDoc.id].prices ={
                      priceId : price.id,
                      priceData: price.data()
                     }
                })
              });
              

            setProducts(productsStripe);
        })
        .catch(error =>{
          alert(error.message);
        })
    },[]);//fetching data only once from db since data wont change for every user
 
 

    const loadCheckout = async (priceId)=>{
      

       const docRef =  doc(db,`customers/${user.uid}`);

       const checkoutRef = collection(docRef,'checkout_sessions');

       const checkoutDoc = await addDoc(checkoutRef,{
        price:priceId,
        success_url:"http://localhost:5173/home",
        cancel_url:"http://localhost:5173/home"
       })


        //succeess url when user succesfully purchases item , than he should be redirected to the home page which is window.location.origin
        // cancel url when user cancels the payment, than he should be sent back so we are telling that only

        onSnapshot(checkoutDoc,async (snap) =>{
           const {error,sessionId} = snap.data();
            if(error){
            //Show an error to your customer and
            //inspect your Cloud function logs in the Firebase console.
            alert(`An error occured: ${error.message}`);
            }
            if(sessionId){
            //We have a session, lets redirect to Checkout
            //Init stripe

            const stripe = await loadStripe(`${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`)
            stripe.redirectToCheckout({sessionId});
            }
          });

    }

    const customerPortal = () => {
      window.location.replace(`https://billing.stripe.com/p/login/test_3cs9BK0fVbu3cEw000?prefilled_email=${user.email}`);
    };
   
  return (
    <div className='planScreen'>
   {/* render the renewal date only if subscribed */}
    {/* here current_period_end is in seconds woh relative wala jo 1st jan 1970 se chala aa raha hai , bas usi ko convert karne ka formulae hai yeh */}
   {subscription && <p>
     {/* here current_period_end is in seconds woh relative wala jo 1st jan 1970 se chala aa raha hai , bas usi ko convert karne ka formulae hai yeh */}
    Renewal Date: {subscription? new Date( subscription.current_period_end * 1000).toLocaleDateString() : " "}</p>}
 {/* once we have products , we need to map it
      but products is an object , so we cant literally map through it like we would do it in an array like we cant use .map() function for object

      so to map through an object what will do is Object.entries(pass the object)  <-- will give us an array back
      once we get the array than we can easily use map function as we have been using it
 
 
 */}
 
  {
    Object.entries(products).map(([productId,productData]) =>{
      //TODO add some logic to check if the users subscription is active
      // i.e checking whether the productData.name i.e product plan matches with the role that we had inserted in stripe product metadata as firebase role so we get to know whether its premium or standard blah blah blah
      const isCurrentPackage = productData.name
      ?.toLowerCase()
      .includes(subscription?.role);
    
     
     
    
      return (
          <div className={`${isCurrentPackage && 'bg-gray-200'}  flex w-full justify-between p-[20px] opacity-80 hover:opacity-100`} key={productId}>
          <div >
            <h5 className='pb-4'>{productData.name}</h5>
            <h6>{productData.description}</h6>
            
          </div>
          
           
          {/* trigger the loadcheckOut only for buttons that are not subscribed, for Currently Subscribed we should not loadCheckout since person has already bought it */}
          {  
            !isCurrentPackage &&<button onClick={()=>loadCheckout(productData.prices.priceId)}
            className={`${isCurrentPackage && 'bg-gray-900'} bg-[#e50914] text-white cursor-pointer pt-[10px] pb-[10px] pl-[20px] pr-[20px]`} >
               Subscribe
            </button>
          }
          {console.log(productData)}
          {
            isCurrentPackage && <button
            onClick={customerPortal}
            className={ 'bg-gray-700 text-white'}  
               target="_blank">{subscription?.role == 'premium' ? "Manage Subscription" : "Wanna Upgrade ?"}
        </button>
          }


        </div>
      )
    })


  }

    </div>
  )
}

export default PlanScreen