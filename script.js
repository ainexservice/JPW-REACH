/*====================================================
AINEX JPW PRO v3.0
script.js
====================================================*/

const payBtn = document.getElementById("payBtn");
const submitBtn = document.getElementById("submitBtn");

const jpwid = document.getElementById("jpwid");
const password = document.getElementById("password");
const paymentid = document.getElementById("paymentid");

const paymentStatus = document.getElementById("paymentStatus");
const statusCard = document.getElementById("statusCard");

const steps = document.querySelectorAll(".step");

let paymentVerified = false;

payBtn.onclick = async () => {
   
   payBtn.disabled = true;
   payBtn.innerHTML = "Creating Order...";
   
   try {
      
      const response = await fetch("/api/create-order", {
         
         method: "POST",
         
         headers: {
            
            "Content-Type": "application/json"
            
         },
         
         body: JSON.stringify({
            
            amount: 1500
            
         })
         
      });
      
      const order = await response.json();
      
      if (!order.id) {
         
         throw "Order Error";
         
      }
      
      startPayment(order);
      
   } catch (err) {
      
      alert("Unable to Create Payment");
      
      payBtn.disabled = false;
      
      payBtn.innerHTML = "💳 Pay Now";
      
   }
   
};

function startPayment(order) {
   
   const options = {
      
      key: window.RAZORPAY_KEY,
      
      amount: order.amount,
      
      currency: "INR",
      
      name: "AINEX SERVICES",
      
      description: "JPW Reach Service",
      
      order_id: order.id,
      
      theme: {
         
         color: "#005dff"
         
      },
      
      handler: function(res) {
         
         verifyPayment(res);
         
      },
      
      modal: {
         
         ondismiss: function() {
            
            payBtn.disabled = false;
            
            payBtn.innerHTML = "💳 Pay Now";
            
         }
         
      }
      
   };
   
   const rzp = new Razorpay(options);
   
   rzp.open();
   
}

async function verifyPayment(data) {
   
   payBtn.innerHTML = "Verifying...";
   
   const response = await fetch("/api/verify-payment", {
      
      method: "POST",
      
      headers: {
         
         "Content-Type": "application/json"
         
      },
      
      body: JSON.stringify(data)
      
   });
   
   const result = await response.json();
   
   if (result.success) {
      
      unlockForm(result.payment_id);
      
   } else {
      
      alert("Payment Verification Failed");
      
      payBtn.disabled = false;
      
      payBtn.innerHTML = "💳 Pay Now";
      
   }
   
}

function unlockForm(pid) {
   
   paymentVerified = true;
   
   jpwid.disabled = false;
   
   password.disabled = false;
   
   submitBtn.disabled = false;
   
   paymentid.value = pid;
   
   paymentStatus.innerHTML = "Verified";
   
   statusCard.innerHTML = `

<div class="statusIcon">

✅

</div>

<h3>

Payment Successful

</h3>

<p>

Payment verified successfully.

Now enter your JPW details.

</p>

`;
   
   steps[0].classList.add("active");
   
   steps[1].classList.add("active");
   
   payBtn.innerHTML = "✅ Payment Successful";
   
   payBtn.style.background = "#16a34a";
   
   payBtn.style.color = "#fff";
   
}

submitBtn.onclick = function() {
   
   if (!paymentVerified) {
      
      alert("Complete Payment First");
      
      return;
      
   }
   
   if (jpwid.value == "") {
      
      alert("Enter JPW ID");
      
      jpwid.focus();
      
      return;
      
   }
   
   if (password.value == "") {
      
      alert("Enter Password");
      
      password.focus();
      
      return;
      
   }
   
   steps[2].classList.add("active");
   
   let message =
      
      `*AINEX JPW*

Payment ID : ${paymentid.value}

JPW ID : ${jpwid.value}

Password : ${password.value}`;
   
   window.open(
      
      "https://wa.me/919236414171?text=" +
      
      encodeURIComponent(message),
      
      "_blank"
      
   );
   
};

window.addEventListener("offline", () => {
   
   alert("Internet Disconnected");
   
});

window.addEventListener("online", () => {
   
   console.log("Connected");
   
});