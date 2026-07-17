import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import logo1 from './logo1.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    logo1
}

export const specialityData = [
    {
        speciality: 'Psychiatrist',
        image: Neurologist
    },
    {
        speciality: 'Clinical Psychologist',
        image: General_physician
    },
    {
        speciality: 'Counselling Psychologist',
        image: Pediatricians
    },
    {
        speciality: 'Psychotherapist',
        image: Gynecologist
    },
    {
        speciality: 'Child & Adolescent Psychiatrist',
        image: Pediatricians
    },
    {
        speciality: 'Addiction Psychiatrist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Maya Sharma',
        image: doc1,
        speciality: 'Psychiatrist',
        degree: 'MD Psychiatry',
        experience: '8 Years',
        about: 'Dr. Maya Sharma focuses on mood disorders, anxiety, and medication-assisted treatment plans with regular follow-up care.',
        fees: 90,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Arjun Mehta',
        image: doc2, 
        speciality: 'Clinical Psychologist',
        degree: 'MPhil Clinical Psychology',
        experience: '6 Years',
        about: 'Dr. Arjun Mehta provides cognitive behavioral therapy and structured assessments for anxiety, depression, and stress-related concerns.',
        fees: 75,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Nisha Verma',
        image: doc3,
        speciality: 'Counselling Psychologist',
        degree: 'MA Counselling Psychology',
        experience: '5 Years',
        about: 'Dr. Nisha Verma supports clients through relationship difficulties, burnout, and workplace stress using practical coping strategies.',
        fees: 55,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Karan Iyer',
        image: doc4,
        speciality: 'Psychotherapist',
        degree: 'MSc Psychotherapy',
        experience: '7 Years',
        about: 'Dr. Karan Iyer offers trauma-informed psychotherapy sessions for long-term emotional healing and resilience building.',
        fees: 70,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Riya Kapoor',
        image: doc5,
        speciality: 'Child & Adolescent Psychiatrist',
        degree: 'MD Psychiatry',
        experience: '9 Years',
        about: 'Dr. Riya Kapoor specializes in adolescent emotional health, attention concerns, and family-centered psychiatric support.',
        fees: 95,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Vivek Rao',
        image: doc6,
        speciality: 'Addiction Psychiatrist',
        degree: 'MD Psychiatry',
        experience: '10 Years',
        about: 'Dr. Vivek Rao helps patients with dependency disorders through recovery plans, relapse prevention, and close monitoring.',
        fees: 100,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Sneha Bhat',
        image: doc7,
        speciality: 'Psychiatrist',
        degree: 'DNB Psychiatry',
        experience: '6 Years',
        about: 'Dr. Sneha Bhat treats panic disorder, insomnia, and bipolar spectrum conditions with patient-friendly treatment planning.',
        fees: 85,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Neel Joshi',
        image: doc8,
        speciality: 'Clinical Psychologist',
        degree: 'PsyD',
        experience: '4 Years',
        about: 'Dr. Neel Joshi focuses on behavioral interventions and evidence-based therapy to improve daily functioning.',
        fees: 65,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Priya Nair',
        image: doc9,
        speciality: 'Counselling Psychologist',
        degree: 'MA Applied Psychology',
        experience: '3 Years',
        about: 'Dr. Priya Nair works with college students and working adults for stress management, confidence, and emotional balance.',
        fees: 50,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Akash Menon',
        image: doc10,
        speciality: 'Psychotherapist',
        degree: 'MSc Clinical Psychotherapy',
        experience: '5 Years',
        about: 'Dr. Akash Menon offers one-on-one therapy for grief, trauma, and adjustment issues in a confidential environment.',
        fees: 72,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Ishita Sen',
        image: doc11,
        speciality: 'Child & Adolescent Psychiatrist',
        degree: 'MD Psychiatry',
        experience: '7 Years',
        about: 'Dr. Ishita Sen supports children and teenagers with school anxiety, behavioral concerns, and emotional regulation.',
        fees: 88,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Rahul Desai',
        image: doc12,
        speciality: 'Addiction Psychiatrist',
        degree: 'DM Addiction Psychiatry',
        experience: '11 Years',
        about: 'Dr. Rahul Desai treats alcohol and substance dependence with integrated psychiatric and therapy-based interventions.',
        fees: 110,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Ananya Roy',
        image: doc13,
        speciality: 'Psychiatrist',
        degree: 'MD Psychiatry',
        experience: '8 Years',
        about: 'Dr. Ananya Roy provides psychiatric consultation for depression, OCD, and anxiety with comprehensive follow-up.',
        fees: 92,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Kabir Malhotra',
        image: doc14,
        speciality: 'Clinical Psychologist',
        degree: 'MPhil Psychology',
        experience: '6 Years',
        about: 'Dr. Kabir Malhotra conducts psychological evaluations and goal-oriented therapy for emotional and cognitive wellness.',
        fees: 74,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Pooja Kulkarni',
        image: doc15,
        speciality: 'Counselling Psychologist',
        degree: 'MA Counselling',
        experience: '4 Years',
        about: 'Dr. Pooja Kulkarni helps patients navigate grief, self-esteem concerns, and life transitions through supportive counselling.',
        fees: 58,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]