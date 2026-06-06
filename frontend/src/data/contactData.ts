import contactHero from "../assets/images/ContactPage.png";

export const contactPageData = {
    heroImage: contactHero,

    title: "Send a message to us!",

    description:
        "Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.",
    };

export const contactFields = [
    {
        name: "fullName",
        label: "Full Name",
        placeholder: "Enter your full name",
        type: "text",
    },
    {
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        type: "email",
    },
    {
        name: "phone",
        label: "Phone Number",
        placeholder: "+963 xxx xxx xxx",
        type: "tel",
    },
    {
        name: "message",
        label: "Your Message",
        placeholder: "How can we help you?",
        type: "textarea",
    },
];