// import { useState } from "react";
// import "./auth.css";
// import type { FieldConfig } from "../../components/ui/FormInputfields";
// import FormInputField from "../../components/ui/FormInputfields";
// import { Heading1 } from "../../components/ui/HeadingPara";
// import Logo from "../../assets/Images/Logo.svg";

// function App() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const fields: FieldConfig[] = [
//     { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true, },
//     { label: "Password", name: "password", type: "password", placeholder: "Enter your password", required: true, },
//   ];

//   const errors: { [key: string]: string } = {};

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="FormContainer">
//       <div className="IndexHeader">
//          <img src={Logo} alt="ASDimo"/>
//       </div>
//       <div className="login-box">
//         <Heading1 text="LOGIN"/>
//         <div  className="LogIn">
//             {fields.map((field) => (
//               <FormInputField
//                 key={field.name}
//                 {...field}
//                 value={formData[field.name as keyof typeof formData]}
//                 onChange={handleChange}
//                 error={errors[field.name || ""]}
//               />
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;





import { useEffect, useState } from "react";
import "./auth.css";
import type { FieldConfig } from "../../components/ui/FormInputfields";
import FormInputField from "../../components/ui/FormInputfields";
import { Heading1 } from "../../components/ui/HeadingPara";
import Logo from "../../assets/Images/Logo.svg";
import Loader from "../../components/ui/Loaders"; 

function LoginForm() {
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fields: FieldConfig[] = [
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
    },
  ];

  const errors: { [key: string]: string } = {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
        <Loader/>
    );
  }

  return (
    <div className="FormContainer">
      <div className="IndexHeader">
        <img src={Logo} alt="ASDimo" />
      </div>

      <div className="login-box">
        <Heading1 text="LOGIN" />

        <div className="LogIn">
          {fields.map((field) => (
            <FormInputField
              key={field.name}
              {...field}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              error={errors[field.name || ""]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoginForm;