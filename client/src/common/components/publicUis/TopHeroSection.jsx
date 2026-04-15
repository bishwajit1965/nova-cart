import HeroImage from "../../../assets/Nova-Cart_Hero-Image.png";

const TopHeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden rounded-lg shadow-2xl">
      {/* BACKGROUND IMAGE LAYER */}
      <img
        src={HeroImage}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT */}
          <div className="lg:col-span-6 text-white space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Your Trusted Online Marketplace
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400">
                Nova-Cart
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg opacity-90">
              Shop smarter. Faster experience. Quality products.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 py-2 bg-green-500 rounded">
                View Categories
              </button>
              <button className="px-4 py-2 bg-blue-500 rounded">
                Buy Products
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-full h-64 w-64 sm:h-80 sm:w-80 flex flex-col items-center justify-center text-white text-center">
              <div className="text-xl sm:text-2xl font-bold">1200+</div>
              <div className="text-sm">Happy Customers</div>

              <div className="text-xl sm:text-2xl font-bold mt-3">500+</div>
              <div className="text-sm">Products</div>

              <div className="text-xs mt-4">🔒 Secured Payments</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopHeroSection;

// import { CheckCircle, RocketIcon, ShoppingBag } from "lucide-react";
// import Button from "../ui/Button";
// import { motion } from "framer-motion";
// import SocialMediaLinks from "../../utils/socialMediaLinks/SocialMediaLinks";
// import HeroImage from "../../../assets/Nova-Cart_Hero-Image.png";

// const statsData = [
//   { value: 1200, label: "Happy Customers" },
//   { value: 500, label: "Products" },
//   { value: 99, label: "Delivery Success" },
// ];

// const TopHeroSection = () => {
//   return (
//     <section className="relative w-full rounded-xl overflow-hidden shadow-2xl">
//       {/* IMAGE (controls everything correctly) */}
//       <img
//         src={HeroImage}
//         alt="Nova Cart Hero"
//         className="w-full h-auto block"
//       />

//       {/* OVERLAY */}
//       <div className="absolute inset-0 bg-black/60 flex items-center">
//         <div className="max-w-7xl mx-auto px-6 w-full text-white">
//           <div className="grid lg:grid-cols-12 grid-cols-1 gap-6 items-center">
//             {/* LEFT */}
//             <motion.div
//               className="space-y-6 lg:col-span-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">
//                 Your Trusted Online Marketplace
//                 <span className="block bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
//                   Nova-Cart
//                 </span>
//               </h1>

//               <p className="text-base lg:text-lg opacity-90">
//                 Shop smarter. Experience faster. Premium-quality products,
//                 transparent policies, and a smooth journey.
//               </p>

//               <div className="flex flex-wrap gap-4">
//                 <Button variant="success" size="lg" href="/product-categories">
//                   <RocketIcon size={18} /> View categories
//                 </Button>

//                 <Button
//                   href="/client-cart-management"
//                   variant="primary"
//                   size="lg"
//                 >
//                   <ShoppingBag size={18} /> Buy Products
//                 </Button>
//               </div>

//               <ul className="space-y-2 mt-4">
//                 {[
//                   "100% Secure Online Shopping",
//                   "Fast Delivery Across Bangladesh",
//                   "Dedicated Customer Support",
//                   "Authentic Products",
//                   "Easy Return Policy",
//                 ].map((item, index) => (
//                   <li key={index} className="flex items-start gap-2">
//                     <CheckCircle size={18} className="text-indigo-400" />
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>

//               <SocialMediaLinks />
//             </motion.div>

//             {/* RIGHT */}
//             <div className="hidden lg:flex lg:col-span-6 justify-end">
//               <div className="bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-2xl h-80 w-80 flex flex-col justify-center items-center text-white">
//                 {statsData.map((stat, i) => (
//                   <div key={i} className="text-center my-2">
//                     <div className="text-2xl font-bold">{stat.value}+</div>
//                     <div className="text-sm opacity-90">{stat.label}</div>
//                   </div>
//                 ))}
//                 <div className="text-sm mt-3">🔒 Secured Payments</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TopHeroSection;

// import { CheckCircle, RocketIcon, ShoppingBag } from "lucide-react";
// import Button from "../ui/Button";
// import { motion } from "framer-motion";
// import SocialMediaLinks from "../../utils/socialMediaLinks/SocialMediaLinks";
// import HeroImage from "../../../assets/Nova-Cart_Hero-Image.png";

// const statsData = [
//   { value: 1200, label: "Happy Customers" },
//   { value: 500, label: "Products" },
//   { value: 99, label: "Delivery Success" },
// ];

// const containerVariants = {
//   hidden: {},
//   visible: {
//     transition: { staggerChildren: 0.3 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
// };

// const TopHeroSection = () => {
//   return (
//     <section className="relative w-full lg:min-h-screen bg-[url(./assets/Nova-Cart_Hero-Image.png)] bg-cover bg-center bg-no-repeat shadow-2xl rounded-xl">
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-xs-disabled rounded-xl"></div>

//       {/* Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 lg:py-20">
//         <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-10 gap-5 items-center">
//           {/* LEFT SIDE CONTENT */}
//           <motion.div
//             className="text-white space-y-6 lg:col-span-6 col-span-12"
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//           >
//             <motion.h1
//               className="text-3xl lg:text-5xl font-extrabold leading-tight drop-shadow-md"
//               variants={itemVariants}
//             >
//               Your Trusted Online Marketplace{" "}
//               <span className="block bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
//                 Nova-Cart
//               </span>
//             </motion.h1>

//             <motion.p
//               className="text-base lg:text-lg opacity-90 leading-relaxed"
//               variants={itemVariants}
//             >
//               Shop Smarter. Experience Faster. Premium-quality products,
//               transparent policies, and a smooth shopping journey — all in one
//               place.
//             </motion.p>

//             {/* CTA Buttons */}
//             <motion.div
//               className="flex flex-wrap gap-4"
//               variants={itemVariants}
//             >
//               <Button
//                 variant="success"
//                 size="lg"
//                 href="/product-categories"
//                 className="lg:w-44 w-full"
//               >
//                 <RocketIcon size={18} /> View categories
//               </Button>

//               <Button
//                 href="/client-cart-management"
//                 variant="primary"
//                 size="lg"
//                 className="lg:w-44 w-full"
//               >
//                 <ShoppingBag size={18} /> Buy Products
//               </Button>
//             </motion.div>

//             {/* Policies List */}
//             <motion.ul className="space-y-2 mt-4" variants={itemVariants}>
//               {[
//                 "100% Secure Online Shopping",
//                 "Fast Delivery Across Bangladesh",
//                 "Dedicated Customer Support",
//                 "Authentic & Quality-Assured Products",
//                 "Easy Return & Refund Policy",
//               ].map((item, index) => (
//                 <motion.li
//                   key={index}
//                   className="flex items-start gap-2 text-sm lg:text-base"
//                   whileHover={{ scale: 1.05 }}
//                   transition={{ type: "spring", stiffness: 150 }}
//                 >
//                   <CheckCircle size={18} className="text-indigo-400" />
//                   <span>{item}</span>
//                 </motion.li>
//               ))}
//             </motion.ul>

//             {/* Social Media Links */}
//             <motion.div variants={itemVariants}>
//               <SocialMediaLinks />
//             </motion.div>
//           </motion.div>

//           {/* RIGHT SIDE: Animated Circle Stats */}
//           <div className="hidden lg:flex lg:col-span-6 justify-end items-center relative">
//             <motion.div
//               initial={{ scale: 0, opacity: 0 }}
//               animate={{ scale: 1, opacity: 0.9 }}
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 1, type: "spring", stiffness: 120 }}
//               className="bg-white/10 border border-white/20
//                rounded-full backdrop-blur-md shadow-2xl
//                flex flex-col justify-center items-center
//                h-96 w-96 text-white
//               "
//             >
//               {statsData.map((stat, i) => (
//                 <div
//                   key={i}
//                   className="flex flex-col items-center space-y-1 lg:space-y-2 text-center my-2"
//                 >
//                   <span className="text-3xl font-bold">{stat.value}+</span>
//                   <span className="text-xs lg:text-sm opacity-90">
//                     {stat.label}
//                   </span>
//                 </div>
//               ))}
//               <span className="text-xs lg:text-sm font-semibold mt-4">
//                 🔒 Secured Payments
//               </span>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TopHeroSection;
