import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {

    const navigate  = useNavigate()

    const { user }= useAuth()

    if(user){
        navigate("/dashboard")
    }

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        role: "",

        standard: "",
        address: {
            houseNo: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
        },

        phone: "",

        subject: ""
    });

    const [error, setError] = useState("")

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [key]: value
                }
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message)
                return;
            }

            console.log(data.data);
            setError("");
            setFormData({
                //For all users
                firstName: "",
                lastName: "",
                email: "",
                username: "",
                password: "",
                role: "",

                //For students
                standard: "",
                address: {
                    houseNo: "",
                    street: "",
                    city: "",
                    state: "",
                    pincode: "",
                },

                //For parents
                phone: "",

                //For teachers
                subject: ""
            });

            navigate("/");

        } catch (err) {
            console.log("Registration error : ", err)
            // setError("Server error. Please try again later.");
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="border p-2 rounded"
                        value={formData.firstName}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="border p-2 rounded"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2 rounded w-full mt-4"
                    onChange={handleChange}
                    value={formData.email}
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="border p-2 rounded w-full mt-4"
                    onChange={handleChange}
                    value={formData.username}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2 rounded w-full mt-4"
                    onChange={handleChange}
                    value={formData.password}
                />

                <select
                    name="role"
                    className="border p-2 rounded w-full mt-4"
                    onChange={handleChange}
                    value={formData.role}
                >
                    <option value="">Select Role</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="PARENT">PARENT</option>
                    <option value="TEACHER">TEACHER</option>
                </select>

                {formData.role === "STUDENT" && (
                    <>
                        <select
                            name="standard"
                            className="border p-2 rounded w-full mt-4"
                            value={formData.standard}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Standard</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={String(i + 1)}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <input name="address.houseNo" placeholder="House No" className="border p-2 rounded" onChange={handleChange} />
                            <input name="address.street" placeholder="Street" className="border p-2 rounded" onChange={handleChange} />
                            <input name="address.city" placeholder="City" className="border p-2 rounded" onChange={handleChange} />
                            <input name="address.state" placeholder="State" className="border p-2 rounded" onChange={handleChange} />
                            <input name="address.pincode" placeholder="Pincode" className="border p-2 rounded col-span-2" onChange={handleChange} />
                        </div>
                    </>
                )}

                {formData.role === "PARENT" && (
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        className="border p-2 rounded w-full mt-4"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                )}

                {formData.role === "TEACHER" && (
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        className="border p-2 rounded w-full mt-4"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />
                )}

                {error && (
                    <div className="text-red-600 text-sm mb-3">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full mt-6 py-2 rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
