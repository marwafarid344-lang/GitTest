import { id } from "date-fns/locale"

export interface Subject {
  id: string
  name: string
  description: string
  creditHours: number
  code: string
  prerequisites?: string[]
  materials: {
    lectures?: string | string[]
    sections?: string
    videos?: string | string[]
    summaries?: string
    quizzes?: {
      id: string
      name: string
      code: string
      duration: string | number
      questions: number
      jsonFile: string
    }[]
    exams?: string
  }
}

export interface Level {
  subjects: {
    term1: Subject[]
    term2: Subject[]
  }
}

export interface Department {
  name: string
  description: string
  levels: {
    [key: number]: Level
  }
}

export const departmentKeyMap: { [key: string]: string } = {
  'computing and data sciences': 'computing-data-sciences',
  'data science': 'computing-data-sciences',
  'computing & data sciences': 'computing-data-sciences',
  'fcds': 'computing-data-sciences',
  'computing': 'computing-data-sciences',
  
  'business-analytics': 'business-analytics',
  'business analytics': 'business-analytics',
  'ba': 'business-analytics',
  
  'artificial-intelligence': 'artificial-intelligence',
  'artificial intelligence': 'artificial-intelligence',
  'intelligent systems': 'artificial-intelligence',
  'ai': 'artificial-intelligence',
  
  'media-analytics': 'media-analytics',
  'media analytics': 'media-analytics',
  'ma': 'media-analytics',
  
  // Healthcare Informatics
  'healthcare-informatics': 'healthcare-informatics',
  'healthcare informatics': 'healthcare-informatics',
  'hi': 'healthcare-informatics',
  
  // Cybersecurity
  'cybersecurity': 'cybersecurity',
  'cyber security': 'cybersecurity',
  'cs': 'cybersecurity'
}


export const departmentData: { [key: string]: Department } = {
  "computing-data-sciences": {
    name: "Computing and Data Sciences",
    description: "Advanced computing and data science methodologies for modern analytics",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations of linear algebra for data science applications",
              creditHours: 3,
              prerequisites: [],
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yFYYS37ERUHG6Ft_HnC17Jmgo-Zsrg06?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/191trjdbwAtjG6yz65q-C1Hd3gigqoti7?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLvuToPs04FnD1lFBolGr4ROQaxQ_zyC1c&si=6IWNZY0eY_ymFdAq"] ,
                exams: "https://drive.google.com/drive/folders/1vUbUjWsbexiPgjDbJOuh-N43PVDc9hjc?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/150zP5Dc9vDKzazlm37IRttDG-_b-opK1?usp=drive_link"
              },
            },
            {
              id: "calculus",
              name: "Calculus",
              code: "02-24-00102",
              description: "Differential and integral calculus with applications in computing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1LsWVrCXpwVsL7YhGL_QFQhyryvpc_Yon?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1U2LbrtWkf-X8DL3c7Yo12kgV8bbZ0Wb6?usp=drive_link",
                videos: '',
                exams: "https://drive.google.com/drive/folders/1Uf7LaRzQyqxEbTVG0dfmWFzTxmZNHLvB?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1UkJQ6mJmcSb_MTbzT_8liJZTUMCOLARt?usp=drive_link"
              },
            },
            {
              id: "intro-computer-systems",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Fundamentals of computer architecture and system organization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yQK4QiXQ7e7Ui6DLMAGYQa3aTuQp0v9O?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1q0iRgXguAaa2zZTSA9J1smnCwN2PwCAn?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLskaQRgiRMYb0SqvJ-wKx2n4Q3CB5uQ8e&si=wXANl6gRLW404zuP"],
                summaries: "https://drive.google.com/drive/folders/1RFPXNiitr2yiHr1AyCsZWuTX0rYyOwIL?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1hTVXduWW2Icy8HY-uOc5lEiUUM42RSkB?usp=drive_link",
                quizzes: [
                  {
                    id: "CS_001",
                    name: "Chapter 1 : Introduction to Computer Systems",
                    code: "CS_001",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_001.json"
                  },
                  {
                    id: "CS_002",
                    name: "Chapter 2 : Processing and Memory Management",
                    code: "CS_002",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_002.json"
                  },
                  {
                    id: "CS_003",
                    name: "Chapter 3 : Storage",
                    code: "CS_003",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_003.json"
                  },
                  {
                    id: "CS_004",
                    name: "Chapter 4 : Input and Output",
                    code: "CS_004",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_004.json"
                  },
                  {
                    id: "CS_005",
                    name: "Chapter 5 : System Software",
                    code: "CS_005",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_005.json"
                  },
                  {
                    id: "CS_006",
                    name: "Chapter 6 : Applications Software (1/2)",
                    code: "CS_006",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_006.json"
                  }
                  ,{
                    id: "CS_007",
                    name: "Chapter 6 : Applications Software (2/2)",
                    code: "CS_007",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_007.json"
                  }
                  ,{
                    id: "CS_008",
                    name: "Chapter 7 : Computer Networks",
                    code: "CS_008",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_008.json"
                  },
                  {
                    id: "CS_009",
                    name: "Chapter 13 : Program Dev & Programming Languages",
                    code: "CS_009",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_009.json"
                  },
                  {
                    id: "CS_010",
                    name: "Converting Binary to Decimal and Vice Versa",
                    code: "CS_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_010.json"
                  },
                  {
                    id: "CS_011",
                    name: "Converting Binary to Octal and Vice Versa",
                    code: "CS_011",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_011.json"
                  },
                  {
                    id: "CS_012",
                    name: "Converting Binary to Hexadecimal and Vice Versa",
                    code: "CS_012",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_012.json"
                  },
                  {
                    id: "CS_013",
                    name: "Converting Decimal to Octal and Vice Versa",
                    code: "CS_013",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_013.json"
                  },
                  {
                    id: "CS_014",
                    name: "Converting Decimal to Hexadecimal and Vice Versa",
                    code: "CS_014",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_014.json"
                  },
                  {
                    id: "CS_015",
                    name: "Converting Octal to Hexadecimal and Vice Versa",
                    code: "CS_015",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_015.json"
                  },
                  {
                    id: "CS_016",
                    name: "Converting Gray Code to Binary and Vice Versa",
                    code: "CS_016",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_016.json"
                  },
                  {
                    id: "CS_017",
                    name: "Converting BCD to Decimal and Vice Versa",
                    code: "CS_017",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_017.json"
                  }
                ],
              },
            },
            {
              id: "intro-data-sciences",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Overview of data science concepts, tools, and methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10SsZONPzWccvjTQB4ZcHmT0j_FU8b981?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14IwWgXRgD8G2IPJ2op1RdBIj9pgs77LJ?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLNVsyemi1cQyXLWT3vm4GbWzVxAK_4nbR&si=Q7kxeMYT4iXhr2uC"],
                summaries: "https://drive.google.com/drive/folders/13IFz-O_64Ga8y9TyFe13CSovw0xzxdUQ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1adpsd15n6hieC29aQECkrftCHNz20U9c?usp=drive_link",
                quizzes: [
                  {
                    id: "DS_001",
                    name: "Lecture 1 - Introduction to Data Science",
                    code: "DS_001",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_001.json"
                  },
                  {
                    id: "DS_002",
                    name: "Lecture 2 - Big Data",
                    code: "DS_002",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_002.json"
                  },
                  {
                    id: "DS_003",
                    name: "Lecture 3 - Data Analytics lifecycle (Characters)",
                    code: "DS_003",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_003.json"
                  },
                  {
                    id: "DS_004",
                    name: "Lecture 4 - Data Analytics lifecycle (Phases)",
                    code: "DS_004",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_004.json"
                  },
                  {
                    id: "DS_005",
                    name: "Lecture 5 - Clustering Analysis",
                    code: "DS_005",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_005.json"
                  },
                  {
                    id: "DS_006",
                    name: "Lecture 6 - Introduction Association Rules (1/2)",
                    code: "DS_006",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_006.json"
                  },
                  {
                    id: "DS_007",
                    name: "Lecture 7 - Introduction Association Rules (2/2)",
                    code: "DS_007",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_007.json"
                  },
                  {
                    id: "DS_008",
                    name: "Lecture 8 - Data Visualization",
                    code: "DS_008",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_008.json"
                  },
                  {
                    id: "DS_009",
                    name: "Lecture 9 - Classification Analysis",
                    code: "DS_009",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_009.json"
                  },
                  {
                    id: "DS_010",
                    name: "Lecture 10 - Decision Trees",
                    code: "DS_010",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_010.json"
                  }
                ],
              },
            },
            {
              id: "programming-1",
              name: "Programming I",
              code: "02-24-00105",
              description: "Introduction to programming concepts and problem-solving techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1VDUvvvKoRcBfdCAgdO5GUa8ourGzEj43?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14-W3wcsn8gw2ym8CnIo_L6jh0RfQW-mR?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AajYlZGzU_LVrHdoouf8W6ZN&si=_3EUjHYYQd7xAuGr", "https://youtube.com/playlist?list=PL1DUmTEdeA6K7rdxKiWJq6JIxTvHalY8f&si=wl8ryBAWTyTatxTw"],
                summaries: "https://drive.google.com/drive/folders/19GRYDzueyRIB45_CJGn9Qh3_3JkIgfQH?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1wT8Ad9IGifK4NMgE71xXzLhXs4FF0wuc?usp=drive_link",
                quizzes: [
                  {
                    id: "PR1_30001",
                    name: "Chapter 1 : Introduction to Programming",
                    code: "PR1_30001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30001.json"
                  },
                  {
                    id: "PR1_30002",
                    name: "Chapter 2-1 : Introduction to Java Programming",
                    code: "PR1_30002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30002.json"
                  },
                  {
                    id: "PR1_30003",
                    name: "Chapter 2-2 : Java Basics",
                    code: "PR1_30003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30003.json"
                  },
                  {
                    id: "PR1_30004",
                    name: "Chapter 2-3 : Java Basics",
                    code: "PR1_30004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30004.json"
                  },
                  {
                    id: "PR1_30005",
                    name: "Chapter 2-4 : Deep Dive into Java",
                    code: "PR1_30005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30005.json"
                  },
                  {
                    id: "PR1_30006",
                    name: "Chapter 3-1 : Controlling Program Flow",
                    code: "PR1_30006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30006.json"
                  },
                  {
                    id: "PR1_30007",
                    name: "Chapter 3-2 : Controlling Program Flow",
                    code: "PR1_30007",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/programming/programming1/PR1_30007.json"
                  },
                  {
                    id: "PR1_30008",
                    name: "Chapter 4-1 : One Dimensional Arrays",
                    code: "PR1_30008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30008.json"
                  },
                  {
                    id: "PR1_30009",
                    name: "Chapter 4-2 : Multi Dimensional Arrays",
                    code: "PR1_30009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30009.json"
                  },
                  {
                    id: "PR1_30010",
                    name: "Review 1",
                    code: "PR1_30010",
                    duration: "OP", // in minutes
                    questions: 50,
                    jsonFile: "/quizzes/programming/programming1/PR1_30010.json"
                  },
                  {
                    id: "PR1_30011",
                    name: "Review 2",
                    code: "PR1_30011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming1/PR1_30011.json"
                  },
                  {
                    id: "PR1_30012",
                    name: "Tracing and Debugging",
                    code: "PR1_30012",
                    duration: "OP", // in minutes
                    questions: 50,
                    jsonFile: "/quizzes/programming/programming1/PR1_30012.json"
                  },
                ],
              
              },
            },
            {
              id: "critical-thinking",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Development of analytical and critical thinking skills",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1mGHqF_BIXdX-S6BipXm942CsOvr6WHTG?usp=drive_link",
                sections: '',
                videos: ["https://youtube.com/playlist?list=PL2y4AZEEnQLmigukmMl5lD0CkewT1pBQ3&si=GijvUZQgn4vO1gdR"],
                summaries: "https://drive.google.com/drive/folders/1He5H59nOzExcoG5GYaujPWQVnKTZwD2Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ZfnkRMneHYU5wYlq4738XZt1NvGlRbt6?usp=drive_link"
              },
            },
            {
              id: "math-0",
              name: "Math 0",
              code: "02-00-000XX",
              description: "A special material for science students in high school",
              creditHours: 0,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1YrNrKQC_tGwSoNuESo8xx31dpJNL7Kat?usp=drive_link",
                sections: 'https://drive.google.com/drive/folders/1bGm1W2on979HuF1b618GI4S7UJ8ngkFK?usp=drive_link',
                videos: [""],
                summaries: "https://drive.google.com/drive/folders/1mQ6p7lVfmr_fKKYOYP9aBWwVeGEVGa4N?usp=drive_link",
                exams: ""
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Fundamental concepts of probability theory and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/14WxYDv-3V5hBNF2FTrLEKkZpPQJjwyUb?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yy9aqzmJsEDZasn2VT1nfzIdJoajEf6F?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PL7snZ0LSsq3g9NUio7xFDtC9IVIj649GV","https://youtube.com/playlist?list=PLXCWPoTuIpYbXgbNuQkBHlMwjK6DpnQ3l"],
                summaries: "https://drive.google.com/drive/folders/1CmL8lOIlbHdYCAhNa5cJSbDSTGEJVdMt?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1reVZYtR8aOBqpHY8PSn2vmwVwNCS_nQC?usp=drive_link"
              },
            },
            {
              id: "discrete-structures",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures and logic for computer science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/12dEJoHHZhCBjBG1KiV2T92HLsGRtDIn8?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1KnWe1Ciq3ETioGCIApu89Sc3Y1FvEgIO?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLxIvc-MGOs6gZlMVYOOEtUHJmfUquCjwz",
                summaries: "https://drive.google.com/drive/folders/1sqiDSQMkoYZCehzIgdyxZcNRSYpIkLnX?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1SgzQqrBfbam-yqOw8xOdq9SKXPlScR2k?usp=drive_link",
                quizzes: [
                  {
                    id: "DM_001",
                    name: "Intro to Discrete Math",
                    code: "DM_001",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_001.json"
                  },
                  {
                    id: "DM_002",
                    name: "Bit Operations",
                    code: "DM_002",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_002.json"
                  },
                  {
                    id: "DM_003",
                    name: "Predicates and Quantifiers",
                    code: "DM_003",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_003.json"
                  },
                  {
                    id: "DM_004",
                    name: "Sets and Functions",
                    code: "DM_004",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_004.json"
                  },
                  {
                    id: "DM_005",
                    name: "Set Operations",
                    code: "DM_005",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_005.json"
                  },
                  {
                    id: "DM_006",
                    name: "Functions Domain",
                    code: "DM_006",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_006.json"
                  },
                  {
                    id: "DM_007",
                    name: "Product Rule",
                    code: "DM_007",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_007.json"
                  },
                  {
                    id: "DM_008",
                    name: "Password Counting",
                    code: "DM_008",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_008.json"
                  },
                  {
                    id: "DM_009",
                    name: "Permutations Combinations",
                    code: "DM_009",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_009.json"
                  },
                ]
              },
            },
            {
              id: "data-structures-algorithms",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Fundamental data structures and algorithmic problem-solving",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1U2vmhFrPOs46SZk-rNdzE4yrCIPL5Qow?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1nr2Og9PqyiRYGl7jFJOtgZx1LGZfeHvY?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp",
                summaries: "https://drive.google.com/drive/folders/1Oiki77OjApABjz0z7D3j2g-Kxc7-hN59?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1IADSkBhDhvgjpDJecfTf9VlvdoJ9P2hD?usp=drive_link",
                quizzes: [
                  {
                    id: "STR_001",
                    name: "Introduction to Data Structures",
                    code: "STR_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_001.json"
                  },
                  {
                    id: "STR_002",
                    name: "Singly Linked List",
                    code: "STR_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_002.json"
                  },
                  {
                    id: "STR_003",
                    name: "Doubly Linked List",
                    code: "STR_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_003.json"
                  },
                  {
                    id: "STR_004",
                    name: "Hash Table",
                    code: "STR_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_004.json"
                  },
                  {
                    id: "STR_005",
                    name: "Stack - Queue - PQ",
                    code: "STR_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_005.json"
                  },
                  {
                    id: "STR_006",
                    name: "BST (Binary Search Tree)",
                    code: "STR_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_006.json"
                  },
                  {
                    id: "STR_007",
                    name: "Sorting Algorithms",
                    code: "STR_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_007.json"
                  },
                  {
                    id: "STR_008",
                    name: "Heap Tree",
                    code: "STR_008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_008.json"
                  },
                  {
                    id: "STR_009",
                    name: "General Review (Part 1)",
                    code: "STR_009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_009.json"
                  },
                  {
                    id: "STR_010",
                    name: "General Review (Part 2)",
                    code: "STR_010",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_010.json"
                  },
                ]
              },
            },
            {
              id: "intro-artificial-intelligence",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Basic concepts and applications of artificial intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1tp-If4eJhcAY4dIzgSieKIj3YVdSF-8m?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYXjZlFJL8FfAKoyhDbshpwwLVBN700R?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1RaS9fI4MaHKg_Bxs_GgyYE_LVuaG3kaJ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1jjGy4TJ8EbON_k0hf2exQNQtQx2KR4wr?usp=drive_link"
              },
            },
            {
              id: "programming-2",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming concepts and software development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yiF9hcqLqa-wyKfEzdiWDF0bR4A_VtK2?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1geGGbmFKJYIN1yvyIskEeRyI0Y8zWhpU?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AagY7fFlhCrjpLiIFybW3yQv","https://youtube.com/playlist?list=PL1DUmTEdeA6Icttz-O9C3RPRF8R8Px5vk"],
                summaries: "https://drive.google.com/drive/folders/1VGGZWwQmZdVD8LWI6piI_RzQqdwKq_st?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1dxwniB91RAEtAu0hKLt5cWqb3t1Q0FLI?usp=drive_link",
                quizzes: [
                  {
                    id: "PR2_50001",
                    name: "Functions - Methods (Part 1)",
                    code: "PR2_50001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50001.json"
                  },
                  {
                    id: "PR2_50002",
                    name: "Functions - Methods (Part 2)",
                    code: "PR2_50002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50002.json"
                  },
                  {
                    id: "PR2_50003",
                    name: "Introduction To Object-Oriented Programming",
                    code: "PR2_50003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50003.json"
                  },
                  {
                    id: "PR2_50004",
                    name: "Constructor and It's Types",
                    code: "PR2_50004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50004.json"
                  },
                  {
                    id: "PR2_50005",
                    name: "Inheritance and Polymorphism (Part 1)",
                    code: "PR2_50005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50005.json"
                  },
                  {
                    id: "PR2_50006",
                    name: "Inheritance and Polymorphism (Part 2)",
                    code: "PR2_50006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50006.json"
                  },
                  {
                    id: "PR2_50007",
                    name: "Abstract Class and Interface",
                    code: "PR2_50007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50007.json"
                  },
                  {
                    id: "PR2_50008",
                    name: "Class Relations (Part 1)",
                    code: "PR2_50008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50008.json"
                  },
                  {
                    id: "PR2_50009",
                    name: "Class Relations (Part 2)",
                    code: "PR2_50009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50009.json"
                  },
                  {
                    id: "PR2_50010",
                    name: "Array List in Java",
                    code: "PR2_50010",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50010.json"
                  },
                  {
                    id: "PR2_50011",
                    name: "Exception Handling",
                    code: "PR2_50011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50011.json"
                  },
                  {
                    id: "PR2_50012",
                    name: "Static Keyword and Static Methods",
                    code: "PR2_50012",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50012.json"
                  },
                  {
                    id: "PR2_50013",
                    name: "Recursive Methods and Recursion Concept",
                    code: "PR2_50013",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50013.json"
                  },
                ]
              },
            },
            {
              id: "innovation-entrepreneurship",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Principles of innovation and entrepreneurial thinking",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1aEPdYTJoeTy0QhS3j1YE3GnJsjIs_8ij?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1n1AWZVhnH-Hr_8xmF8PiHdzTHYLGIsRa?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1MxzGEcFlQuweR0XHi7zuBMDuIfn00tcZ?usp=drive_link"
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistical methods and probability distributions",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Cat1L5ibgjDAx3qcU8XpKuM2Sp0jIWdA?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/17m-plzdlLyhkjM_TFmcYw5AZyC61yNrx?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL7snZ0LSsq3g6KzD6pdqwU3_Do8WPY4M8&si=1ZMtkTPNNIX7q31M",
                summaries: "https://drive.google.com/drive/folders/1z2c94GAfxG4TdX63ZY_rZSicvEZlrRHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1QRMaP_UgieJRGo5ebwvD_bIu9EMF0SYs?usp=drive_link"
              },
            },
            {
              id: "intro-databases",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database design, implementation, and management principles",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10DIqel1WkLIg5YZ1qbT604vRdpVPyLZ6?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1a78X1gWfKKui7qrsGkHvwycayAssG8Le?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL37D52B7714788190&si=9Qkf5KQWLTXqYKt1",
                summaries: "https://drive.google.com/drive/folders/1vMRqmZ7ID3YIT920N6loq_yJKOQSOG65?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1luaj1L4qB2T3hTcQvwra667abVRXOx9c?usp=drive_link"
              },
            },
            {
              id: "numerical-computations",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods and computational techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1YerbhXBHp9cLVhuBlsp337xKVS_01139?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1K4WIBD41wo7MP_GwXpo6yfEg-93c2wVM?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1WbNyHrPMQg8aBKK3pEUvBplv7gxzsxHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/14RRGt31M6KSQAxypsDQ2sMI_DR939Wy5?usp=drive_link"
              },
            },
            {
              id: "advanced-calculus",
              name: "Advanced Calculus",
              code: "02-24-01201",
              description: "Multivariable calculus and advanced mathematical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1kMuGgdNfirnO_HP6CYKL02-LRJXjpgfh?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/19elXC7fQOQASSTk2cG9pa2GVU1i4gFW3?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1iGMlitjUbTAe-PAr1Gm7ftOqMQjbmjvV?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1NlpAB2MaIloRaoBeiNG2qiZagRn8EYPU?usp=drive_link"
              },
            },
            {
              id: "data-science-methodology",
              name: "Data Science Methodology",
              code: "02-24-01202",
              description: "Systematic approaches to data science projects and research",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1euOjkcK23yHHMKwvx6zOJiPgrj7-m09k?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1C14zdESIjWhVfxFXP5eDsGY5D290Mu6Z?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1G_XU_TmlwWBKyhFUOj0L055GBsTfniJT?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1_PCpSjwGN8wHeO_uB0bthGi6iDcI5AsI?usp=drive_link"
              },
            },
            {
              id: "Economic-science",
              name: "Economy Science",
              code: "HE_005",
              description: "Study of economic principles and their applications",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1_Z4FSE1Dx0oJ9_nxbHoFvn1WP2wN-Iyd?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1LuCRHkTxVc_uKOX7SdVEwcc0WrEL-n2D?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1B_bMKIcqQ4t_PsxDR6-GMUWQOv67AvNK?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1qI0ElMk-nNfGv8hH9h3M51Mz9KvEKhIZ?usp=drive_link",
                quizzes: [
                  {
                    id: "ECO_001",
                    name: "الفصل الاول - مقدمة في علم الاقتصاد",
                    code: "ECO_001",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_001.json"
                  },
                  {
                    id: "ECO_002",
                    name: "الفصل الثاني -المشكلة الاقتصادية والنظم الاقتصادية",
                    code: "ECO_002",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_002.json"
                  },
                  {
                    id: "ECO_003",
                    name: "الفصل الثالث - نظرية طلب المستهلك",
                    code: "ECO_003",
                    duration: "OP",
                    questions: 19,
                    jsonFile: "/quizzes/Economic/ECO_003.json"
                  },
                  {
                    id: "ECO_004",
                    name: "الفصل الرابع - العرض في السوق",
                    code: "ECO_004",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_004.json"
                  },
                  {
                    id: "ECO_005",
                    name: "الفصل الخامس - التوازن في السوق",
                    code: "ECO_005",
                    duration: "OP",
                    questions: 12,
                    jsonFile: "/quizzes/Economic/ECO_005.json"
                  },
                  {
                    id: "ECO_006",
                    name: "الفصل السادس - مرونات العرض والطلب",
                    code: "ECO_006",
                    duration: "OP",
                    questions: 27,
                    jsonFile: "/quizzes/Economic/ECO_006.json"
                  },
                  {
                    id: "ECO_007",
                    name: "الفصل السابع - نظرية المنفعة الحدية",
                    code: "ECO_007",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_007.json"
                  },
                  {
                    id: "ECO_008",
                    name: "الفصل التاسع - نظرية الإنتاج",
                    code: "ECO_008",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_008.json"
                  },
                  {
                    id: "ECO_009",
                    name: "الفصل العاشر - تكاليف الإنتاج",
                    code: "ECO_009",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_009.json"
                  },
                  {
                    id: "ECO_010",
                    name: "الفصل الحادي عشر - اسواق المنافسة الكاملة",
                    code: "ECO_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_010.json"
                  },
                  {
                    id: "ECO_011",
                    name: "الفصل الثاني عشر - اسواق المنافسة غير الكاملة",
                    code: "ECO_011",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_011.json"
                  },
                ],
              },
            },
            {
              id: "university-elective-2",
              name: "Modern Tourism",
              code: "ME_009",
              description: "Study of tourism principles and their economic impact",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1luEP1w4OZmcg05AwcncvVo2ZOi3LIToY?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1vmVid1wxaYgp9cLalkWXA3pXzItuYvAa?usp=drive_link",
                exams: "",
                summaries: "https://drive.google.com/drive/folders/1oCwYJQD0kkOWrECJCFI0uXXv4lpLmklI?usp=drive_link",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms, services, and distributed computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1P37WAFRKgkokNwr6R5MZNOFEpff5dUIB?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1ny-TP92zjTZrctHIBx_QmsTfl52bSP1Q?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/11QHqhN6G_OmTNZTPdR_OVWzUZ5fEMO8X?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ICXoWQy7-nas1_KaLNCA_fHKXEVvRqw2?usp=drive_link",
                quizzes: [
                  {
                    id: "CLC_10661",
                    name: "Introduction to Cloud Computing (Team Materials)",
                    code: "CLC_10661",
                    duration: "OP", // <-- CHANGED THIS LINE
                    questions: 20,
                    jsonFile: "/quizzes/cloud computing/CLC_10661.json"
                  },
                  {
                    id: "CLC_10662",
                    name: "Platform and Infrastructure Services",
                    code: "CLC_10662",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10662.json"
                  },
                  {
                    id: "CLC_10663",
                    name: "Virtualization",
                    code: "CLC_10663",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10663.json"
                  },
                  {
                    id: "CLC_10664",
                    name: "Parallel Programming",
                    code: "CLC_10664",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10664.json"
                  },
                  {
                    id: "CLC_10665",
                    name: "Distributed Storage Systems",
                    code: "CLC_10665",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10665.json"
                  },
                  {
                    id: "CLC_10666",
                    name: "Cloud Security",
                    code: "CLC_10666",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10666.json"
                  },
                  {
                    id: "CLC_10667",
                    name: "Cloud Performance",
                    code: "CLC_10667",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10667.json"
                  },
                  {
                    id: "CLC_10668",
                    name: "General Overview + 20Q of 2025's Midterm",
                    code: "CLC_10668",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10668_TOT.json"
                  }
                ],
              },
            },
            {
              id: "machine-learning",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Supervised and unsupervised learning algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1CCeA8VUvw__jCBmZ-5Y1J3ujOyir4HSr?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1hO_vvmFpCD9zw4rlK77HIIeNVWpjgM2K?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1XdboKP5n65WZCznnqiCrE0BZfiarSl4Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1WI08MEt_kVSuMITdlqqgPaVpTUPwiqgK?usp=drive_link"
              },
            },
            {
              id: "data-mining-analytics",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Techniques for extracting knowledge from large datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Ex-VAzuroLcg0fmSmg-Zd-x6KXCY7P1H?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yRLzmfdAksXPomOZCRLQLG48sWnkQIDc?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1HRedV6Iu8Djd_f0AE0MigL8nKoq8Yb8-?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1mrKwfr3Mgi9p3zp7VdIVLmsUiPYhJYCX?usp=drive_link",
                quizzes:[
                  {
                    id: "MIG_14331",
                    name: "Data Mining Lecture 1,2 (Team Materials)",
                    code: "MIG_14331",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Mining/MIG_14331.json"
                  },
                  {
                    id: "MIG_14332",
                    name: "Data Mining Lecture 2",
                    code: "MIG_14332",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14332.json"
                  },
                  {
                    id: "MIG_14333",
                    name: "Data Mining Lecture 3",
                    code: "MIG_14333",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14333.json"
                  },
                  {
                    id: "MIG_14334",
                    name: "Data Mining Lecture 4",
                    code: "MIG_14334",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14334.json"
                  },
                  {
                    id: "MIG_14335",
                    name: "Data Mining Lecture 5",
                    code: "MIG_14335",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14335.json"
                  },
                  {
                    id: "MIG_14336",
                    name: "Data Mining Lecture 6",
                    code: "MIG_14336",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14336.json"
                  },
                ]
              },
            },
            {
              id: "data-science-tools-software",
              name: "Data Science Tools and Software",
              code: "02-24-01203",
              description: "Practical tools and software for data science workflows",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1CScYtfu-JWA5llL4EQAu46pZgL1lQNui?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1_kQzyyVVwFmFhbyewAgs3PZgfw7SZoVt?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1-E0rOdeA_1463gM9sg93srLn-apu3_fV?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1XJqxJZOjQCzXnEpeyQQQRRc8HOvEwyJ6?usp=drive_link",
                quizzes: [
                  {
                    id: "DST_001",
                    name: "Introduction to Data Science Tools",
                    code: "DST_001",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_001.json"
                  },
                  {
                    id: "DST_002",
                    name: "Visualization",
                    code: "DST_002",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_002.json"
                  },
                  {
                    id: "DST_003",
                    name: "Data Preprocessing",
                    code: "DST_003",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_003.json"
                  },
                  {
                    id: "DST_004",
                    name: "Database Management Systems",
                    code: "DST_004",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_004.json"
                  },
                  {
                    id: "DST_005",
                    name: "Supervised Learning",
                    code: "DST_005",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_005.json"
                  },
                  {
                    id: "DST_006",
                    name: "Unsupervised Learning",
                    code: "DST_006",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_006.json"
                  },
                  {
                    id: "DST_007",
                    name: "Feature Selection and Dimensionality Reduction",
                    code: "DST_007",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_007.json"
                  },
                  {
                    id: "DST_008",
                    name: "Feature Engineering",
                    code: "DST_008",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_008.json"
                  },
                  {
                    id: "DST_009",
                    name: "Review 1",
                    code: "DST_009",
                    duration: "OP",
                    questions: 53,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_009.json"
                  },
                  {
                    id: "DST_010",
                    name: "Review 2",
                    code: "DST_010",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_010.json"
                  },
                  {
                    id: "DST_011",
                    name: "Review 3",
                    code: "DST_011",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Data Science Tools/DST_Quizzes/DST_011.json"
                  }
                ]
              },
            },
            {
              id: "regression-analysis",
              name: "Regression Analysis",
              code: "02-24-01204",
              description: "Linear and nonlinear regression modeling techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Pr__JjKf-CRVGV7BeV1tkrQZfen4YRJO?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1aTANc8wnepGacHG4YjoXxXbEoZu5TBT3?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1sRjognRSht3yw_Qxf-O9NLM9YNsJ5UPJ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1TkHizwhqFL2uaHUU5Wy06SvdxlY8yCis?usp=drive_link"
              },
            },
            {
              id: "first-aids",
              name: "First Aids",
              code: "02-0X-000XX",
              description: "Basic first aid techniques and emergency response",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/17Nw4Ek9RxMEAf1s2H1Kkqe37Yc7PwUqc?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1e4o5muXHUkxZ10e8idAEe8l546IRqQBh?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1XURifRPnlFi7wOcminFvg6EVKxYsFOBS?usp=drive_link",
                quizzes: [
                  {
                    id: "FA_28101",
                    name: "Lecture 1 - Introduction to First Aids",
                    code: "FA_28101",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28101.json"
                  },
                  {
                    id: "FA_28102",
                    name: "Lecture 2 - Cardiopulmonary Resuscitation",
                    code: "FA_28102",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28102.json"
                  },
                  {
                    id: "FA_28103",
                    name: "Lecture 3 - Bleeding",
                    code: "FA_28103",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28103.json"
                  },
                  {
                    id: "FA_28104",
                    name: "Lecture 4 - Wounds",
                    code: "FA_28104",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28104.json"
                  },
                  {
                    id: "FA_28105",
                    name: "Lecture 5 - Burns",
                    code: "FA_28105",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28105.json"
                  },
                  {
                    id: "FA_28106",
                    name: "Lecture 6 - Fractures",
                    code: "FA_28106",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28106.json"
                  },
                  {
                    id: "FA_28107",
                    name: "Lecture 7 - Shocks",
                    code: "FA_28107",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28107.json"
                  },
                  {
                    id: "FA_28108",
                    name: "Lecture 8 - Unconsciousness",
                    code: "FA_28108",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28108.json"
                  },
                  {
                    id: "FA_28109",
                    name: "Lecture 9 - Hyperglycemia",
                    code: "FA_28109",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28109.json"
                  },
                  {
                    id: "FA_28110",
                    name: "Review",
                    code: "FA_28110",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/First Aids/FA_28110.json"
                  },
                ]
              },
            },
            {
              id: "pet-handeling",
              name: "Pet Handeling",
              code: "PH_001",    
              description: "Techniques and best practices for handling pets safely",
              creditHours: 2,
              materials: {
                lectures: ["https://drive.google.com/drive/folders/1XUbeT4ziAWio6R2Orj-FJogu2BAQKDDX?usp=drive_link","https://drive.google.com/drive/folders/1bqlgrDFTRZV787afK5algf9oy4-k2Vt0?usp=drive_link"],
                sections: "",
                exams: "https://drive.google.com/drive/folders/1C_HB4TlRYX-EY03Bm0OnVXtysbx9Mj-q?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1mKEyk5nDDTEDJFzanmnswIKBZ4zOG2FT?usp=drive_link",
              },          
            }
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "stochastic-processes",
              name: "Stochastic Processes",
              code: "02-24-01301",
              description: "Random processes and their applications in data science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1PKWYRXoXWqGpom2A64o1xZvKJZtEuPD1?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1OK_hd7pcqWv_8pm9dXTR4xYx9axAtDcD?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLAtIITWfkz9AquTyThwz7mkg6dGqIXKI3&si=MvjBbLZEfmuJ3BKu",
                summaries: "https://drive.google.com/drive/folders/1ffKJxpEG86cFWOtlDa42CcQSECLlCVeg?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1k6L4jQgzqFxLMFdcPvm3kJp6m8B2bzUc?usp=drive_link"
              },
            },
            {
              id: "design-analysis-experiments",
              name: "Design and Analysis of Experiments",
              code: "02-24-01302",
              description: "Experimental design principles and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Dbp5JfaMcYG9DoJxOlgwL7eTw3n5v2_H?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1vKXnF7anmsn_vUMUCmL8geYGVFwWpz9R?usp=drive_link",
                videos: [""],
                summaries: "https://drive.google.com/drive/folders/1q6Wct_XlOa-vcL5oZQmOh-M4DShs79pm?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1yalskt-sOK3_0envMxfdiVtTXD7OfV-k?usp=drive_link",
                quizzes: [
                  {
                    id: "DOE_001",
                    name: "Introduction to Design of Experiments",
                    code: "DOE_001",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_001.json"
                  },
                  {
                    id: "DOE_002",
                    name: "DOE with Statistics",
                    code: "DOE_002",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_002.json"
                  },
                  {
                    id: "DOE_003",
                    name: "Completely Randomized Design - Testing A Hypothesis",
                    code: "DOE_003",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_003.json"
                  },
                  {
                    id: "DOE_004",
                    name: "Stratified Random Sampling",
                    code: "DOE_004",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_004.json"
                  },
                  {
                    id: "DOE_005",
                    name: "Domain Estimation",
                    code: "DOE_005",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_005.json"
                  },
                  {
                    id: "DOE_006",
                    name: "Cluster Sampling",
                    code: "DOE_006",
                    duration: "OP", // in minutes
                    questions: 15,  
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_006.json"
                  },
                  {
                    id: "DOE_007",
                    name: "Cluster Sampling (continued)",
                    code: "DOE_007",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_007.json"
                  },
                  {
                    id: "DOE_008",
                    name: "Fully Design of Experiments Revision (Theoritical)",
                    code: "DOE_008",
                    duration: "OP", // in minutes
                    questions: 50,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_008.json"
                  },
                  {
                    id: "DOE_009",
                    name: "Fully Design of Experiments Revision (Practical)",
                    code: "DOE_009",
                    duration: "OP", // in minutes
                    questions: 50,
                    jsonFile: "/quizzes/DOE/DOE_Quizzes/DOE_009.json"
                  }
                ]
              },
            },
            {
              id: "data-visualization-tools",
              name: "Data Visualization Tools",
              code: "02-24-01303",
              description: "Tools and techniques for effective data visualization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1cPdkERtei3lc_XCT_5flekoJuYPWZ29Q?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1akup2XLHU9HNVhNrRoVPXGjoJGS_b7xH?usp=drive_link",
                videos: " ",
                summaries: "https://drive.google.com/drive/folders/152JzhYGQ9AiMksjks4mIIoULsYBNQ0Jt?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1g8MeUv89wUc5meya3zO5_DBIIVvc4xu7?usp=drive_link",
                quizzes: [
                  {
                    id: "DVT_001",
                    name: "Introduction to Data Visualization",
                    code: "DVT_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/DVT_001.json"
                  },
                  {
                    id: "DVT_002",
                    name: "Story telling with Data",
                    code: "DVT_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/DVT_002.json"
                  },
                  {
                    id: "DVT_003",
                    name: "Data Encoding Principles (1)",
                    code: "DVT_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/DVT_003.json"
                  },
                  {
                    id: "DVT_004",
                    name: "Data Encoding Principles (2)",
                    code: "DVT_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/DVT_004.json"
                  },
                  {
                    id: "DVT_005",
                    name: "Data Vision",
                    code: "DVT_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/DVT_005.json"
                  },
                  {
                    id: "DVT_006",
                    name: "Data Visual Analytics (1)",
                    code: "DVT_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/DVT_006.json"
                  },
                  {
                    id: "DVT_007",
                    name: "Data Visual Analytics (2)",
                    code: "DVT_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/DVT_007.json"
                  },
                  {
                    id: "VIS_STAR",
                    name: "Fully Data Visualization Revision",
                    code: "VIS_STAR",
                    duration: "OP", // in minutes
                    questions: 140,
                    jsonFile: "/quizzes/Visualization/VIZ_Quizzes/VIS_STAR.json"
                  },
                ],
              },
            },
            {
              id: "Web-Programming",
              name: "Web Programming",
              code: "02-24-00306",
              description: "Explore web development technologies and frameworks to build the next chameleon",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10lmuusGOSB6PCUE0bLTddEKMDubhNmGu?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1elx6DFq_rBC-HBrMUwkvXetROKMb4xYP?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji&si=SrbjHtzgw5XhuvwE","https://youtube.com/playlist?list=PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe&si=iWjgud4FmxHht6-V","https://youtube.com/playlist?list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv&si=IMPINKzaCcwKyPFy"],
                summaries: "https://drive.google.com/drive/folders/1izlOiejC_W5u0KEwRrV3Gn7uGRsMLabV?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1pqHAxus_oyiKwz8aI4qxUAI1hyJeH3LO?usp=drive_link",
                quizzes: [
                  {
                    id: "WP_001",
                    name: "HTML & CSS Basics - P1",
                    code: "WP_001",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_001.json"
                  },
                  {
                    id: "WP_002",
                    name: "HTML & CSS Basics - P2",
                    code: "WP_002",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_002.json"
                  },
                  {
                    id: "WP_003",
                    name: "HTML & CSS Basics - P3",
                    code: "WP_003",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_003.json"
                  },
                  {
                    id: "WP_004",
                    name: "HTML & CSS Basics - P4",
                    code: "WP_004",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_004.json"
                  },
                  {
                    id: "WP_005",
                    name: "HTML & CSS Basics - P5",
                    code: "WP_005",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_005.json"
                  },
                  {
                    id: "WP_006",
                    name: "Java Script Basics - P1",
                    code: "WP_006",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_006.json"
                  },
                  {
                    id: "WP_007",
                    name: "Java Script Basics - P2",
                    code: "WP_007",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_007.json"
                  },
                  {
                    id: "WP_008",
                    name: "Fetch API, HTTP Methods",
                    code: "WP_008",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_008.json"
                  },
                  {
                    id: "WP_009",
                    name: "Promises Async/Await",
                    code: "WP_009",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_009.json"
                  },
                  {
                    id: "WP_010",
                    name: "Forms and Validation",
                    code: "WP_010",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_010.json"
                  },
                  {
                    id: "WP_011",
                    name: "JSON and Storage",
                    code: "WP_011",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_011.json"
                  },
                  {
                    id: "WP_012",
                    name: "Browser Object Model",
                    code: "WP_012",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_012.json"
                  },
                  {
                    id: "WP_013",
                    name: "ES6 and Node.js Basics",
                    code: "WP_013",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/Web/WP_013.json"
                  },
                  {
                    id: "WP_MID",
                    name: "Before Midterm Revision",
                    code: "WP_MID",
                    duration: "OP", // in minutes
                    questions: 90,
                    jsonFile: "/quizzes/Web/WP_MID.json"
                  },
                  {
                    id: "WP_FINAL",
                    name: "After Midterm Revision",
                    code: "WP_FINAL",
                    duration: "OP", // in minutes
                    questions: 50,
                    jsonFile: "/quizzes/Web/WP_FINAL.json"
                  },
                  {
                    id: "WP_STAR",
                    name: "Final Revision Quiz",
                    code: "WP_STAR",
                    duration: "OP", // in minutes
                    questions: 140,
                    jsonFile: "/quizzes/Web/WP_STAR.json"
                  },
                ]
              },
            },
            {
              id: "Computer-Networks",
              name: "Computer Networks",
              code: "02-24-00308",
              description: "Fundamentals of computer networking and communication protocols",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/18EfL-u4z06mBDNki39-XEfShYMKvMUXn?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1XV94AxwvlgXikzZ3qbYR5QtJqNIIe-LI?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PL8v_bZALWLKE9Lo2BIy8nsdsakbSvQlEo&si=jBAfivc5JJCLnv5-"],
                summaries: "https://drive.google.com/drive/folders/1y_ZHb47S0RCveSEoWc17PsXEsQDH019K?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1qPJuDNlabxV5IctxPU1_0tomDLmZIEVR?usp=drive_link",
                quizzes: [
                  {
                    id: "CN_001",
                    name: "Network Devices & Standards",
                    code: "CN_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_001.json"
                  },
                  {
                    id: "CN_002",
                    name: "OSI Model",
                    code: "CN_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_002.json"
                  },
                  {
                    id: "CN_003",
                    name: "Network Protocols and Subnetting",
                    code: "CN_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_003.json"
                  },
                  {
                    id: "CN_004",
                    name: "Ethernet and LAN Technologies",
                    code: "CN_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_004.json"
                  },
                  {
                    id: "CN_005",
                    name: "Network Address Translation (NAT)",
                    code: "CN_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_005.json"
                  },
                  {
                    id: "CN_006",
                    name: "Transport Layer Protocols (TCP/UDP)",
                    code: "CN_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_006.json"
                  },
                  {
                    id: "CN_007",
                    name: "Routing Protocols - OSPF(1)",
                    code: "CN_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_007.json"
                  },
                  {
                    id: "CN_008",
                    name: "OSPF(2) - DR & BDR",
                    code: "CN_008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_008.json"
                  },
                  {
                    id: "CN_009",
                    name: "ACL (Standard & Extended)",
                    code: "CN_009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_009.json"
                  },
                  {
                    id: "CN_010",
                    name: "VLAN - Trunking - VTP",
                    code: "CN_010",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_010.json"
                  },
                  {
                    id: "CN_011",
                    name: "WAN - Frame Relay - DSL",
                    code: "CN_011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_011.json"
                  },
                  {
                    id: "CN_012",
                    name: "Wireless Connection Protocols",
                    code: "CN_012",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_012.json"
                  },
                  {
                    id: "CN_013",
                    name: "Wireshark (Packet Capture)",
                    code: "CN_013",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Computer_Network/CN_013.json"
                  },
                  {
                    id: "CN_STAR",
                    name: "Final Revision Quiz (Anti-long Answers)",
                    code: "CN_STAR",
                    duration: "OP", // in minutes
                    questions: 130,
                    jsonFile: "/quizzes/Computer_Network/CN_STAR.json"
                  },
                ]
              },
            },
            {
              id: "Dist-Processing",
              name: "Dist Processing",
              code: "02-24-00302",
              description: "Explore distributed systems and parallel computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/12niCwNHhJywcK8A9M6RsiY8mI9C2nxyN?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1SHTshE8VjDQvZXAjlOf3uVNr7ntMx-2p?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1YJKn5zhVSV0YiAzfudohb8tO0IKawpKl?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1tdG9OjPWoXds9z1fcJUXO2scrR1ZA4M6?usp=drive_link"
              },
            },
            {
              id: "Fitness-and-Health",
              name: "Fitness and Health",
              code: "02-24-HS001",
              description: "Promoting physical fitness and healthy lifestyle choices",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1aEW9G3GneVHEUPvCwKs2PiQ-kFEbvn5x?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/13posL3y_6GC-0LnQakxkEVfbHnnSWur5?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/162Bx_kHSG2w1hsC-xEWGy3e2oMcGioh7?usp=drive_link"
              },
            },
          ],
          term2: [
            {
              id: "data-computation-analysis",
              name: "Data Computation and Analysis",
              code: "02-24-01304",
              description: "Advanced computational methods for data analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1DyWdkx1w4_8I-3jWEBU78r5AJtukFqaR?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1mdMcLznO8KyNs91IWodCpdN8rdgIeV10?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1Je3MNYuv6V7HIj7dtQp87lt-i0IZ8OR5?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1_xO3Y7VY4qqYUdhncxq8D5IG10xvtN0t?usp=drive_link"
              },
            },
            {
              id: "survey-methodology",
              name: "Survey Methodology",
              code: "02-24-01305",
              description: "Design and implementation of survey research methods",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10Q55FC9PkoQYlV2DiFlwYQqLUn7c0Hvs?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1NwcCR9EQyYjtEqshFechfDzQJwERAr8-?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1AKHPJXp9VVhYGUutKPP7XqgPjfTbrkIf?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1vgvf18-SQ8zlkhFk_HyNQVl6HhzlbtC4?usp=drive_link"
              },
            },
            {
              id: "computing-intensive-statistical-methods",
              name: "Computing Intensive Statistical Methods",
              code: "02-24-01306",
              description: "Computational approaches to complex statistical problems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1rLxUL06kYDhdBrGfB1H-F_s1zomdjqd1?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/149t4EDeg2uQkt97V_m94S6aJYPqCaekY?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL7snZ0LSsq3ghVGnrH2n6jIdY40wFrKcl&si=fRZbzfepWYhW7xGJ",
                summaries: "https://drive.google.com/drive/folders/1KJuTX2s7cXjBiX9al646SbgwfGXRLBXf?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1FVBJtarizr-5ZQbTRMZ3CQ5YaQlyusOV?usp=drive_link"
              },
            },
            // {
            //   id: "algorithm-design",
            //   name: "Algorithm Design",
            //   code: "02-24-0X0XX",
            //   description: "Design and analysis of efficient algorithms",
            //   creditHours: 3,
            //   materials: {
            //     lectures: "https://drive.google.com/drive/folders/1iOGtM71_PlCnaT5uD9bYSdqhlThfCXMI?usp=drive_link",
            //     sections: "https://drive.google.com/drive/folders/11dk-88iCFHc_XGxy59t-CGgba0agQVSC?usp=drive_link",
            //     videos: "",
            //     summaries: "https://drive.google.com/drive/folders/1PU9XmZgUtI8UBBCoGvgD1xim6SwrImdn?usp=drive_link",
            //     exams: "https://drive.google.com/drive/folders/1MolIrIQb07FOLf3PwwhCcVy_PW5NH7sg?usp=drive_link",
            //   },
            // },
            {
              id: "advanced-database-systems",
              name: "Advanced Database Systems",
              code: "02-24-0X0XX",
              description: "In-depth study of database architectures and management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1YJH8ZbwFduRGbS07v6nx2R66pqMkumyP?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1OyFp7CRNwfGf3vHNbp5ZOTaDcwkCPFA7?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1trcmqKcpKAGVRNmGBl2ROkGeoete6nkO?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1HalJgXrhKyBuFRHGj0Z9WZiUQWr7GlmJ?usp=drive_link",
              },
            },
            // {
            //   id: "convex-optimization",
            //   name: "Convex Optimization",
            //   code: "02-24-0X0XX",
            //   description: "Techniques and applications of convex optimization",
            //   creditHours: 3,
            //   materials: {
            //     lectures: "https://drive.google.com/drive/folders/1PYIW3EDLw9NAyZQyEb2DusgVHHcLJV6M?usp=drive_link",
            //     sections: "https://drive.google.com/drive/folders/1tFnr-E5ELvZKUVozVuVMMRD3ISlzdd1D?usp=drive_link",
            //     videos: "",
            //     summaries: "https://drive.google.com/drive/folders/1dj1SQFmohMdDo7EVlr2mGXo7ZBWcxSpn?usp=drive_link",
            //     exams: "https://drive.google.com/drive/folders/1VcS8JRTUQWcCsUOyfxxEcJiqBANgfhAW?usp=drive_link",
            //   },
            // },
            {
              id: "operating-systems",
              name: "Operating Systems",
              code: "02-24-0X0XX",
              description: "Fundamentals of operating system design and implementation",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1EpjZJ58zbMRasFyPNySKmYJuG7b-Bvua?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYW5w49TuHYjjaQolerASZ58QYH7HH48?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/12S1na5_w3TYn6AP1xGcz4-MVK4PwuSm_?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1aS7ppq-ylQ6EAtYcndF_S5dijNKSqY25?usp=drive_link",
              },
            },
            {
              id: "software-engineering",
              name: "Software Engineering",
              code: "02-24-0X0XX",
              description: "Fundamentals of software engineering principles and practices",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/14kAH4lk1B8-_gt_jwGIVlPYDXUMqh9Ot?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1UAOG8RjkjYK5P5qCAKIhgp-YMCqkbzGc?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/13C2VAFVwKFB2HHckl27f9dXfInsApJ_z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1gEr6m40AJJ1aawnhCMavO_2KCCKvAS8j?usp=drive_link",
              },
            },
            {
              id: "System-Analysis-Design",
              name: "System Analysis and Design",
              code: "02-24-00304",
              description: "Explore system development life cycle and design methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1XCk9YrAfo70uV9hfybNmvLvJn69lHFiZ?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/10ttM9_EA2sEAPEj6_fsyKEaxP2AItRcP?usp=drive_link",
                videos: [""],
                summaries: "https://drive.google.com/drive/folders/1-TUMlZnHgD5NSahx8Ab5v8tR4gBZ_bGy?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1bYzfL7z6ce132wz5wAEYxWP29khFj81k?usp=drive_link"
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "big-data-analytics",
              name: "Big Data Analytics",
              code: "02-24-01401",
              description: "Processing and analyzing large-scale datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/big-data-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/big-data-analytics-sections",
                videos: "https://youtube.com/playlist?list=big-data-analytics-videos",
                summaries: "https://drive.google.com/drive/folders/big-data-analytics-summaries",
                exams: "https://drive.google.com/drive/folders/big-data-analytics-lastexam",
              },
            },
            {
              id: "intro-social-networks",
              name: "Introduction to Social Networks",
              code: "02-24-01402",
              description: "Analysis of social network structures and dynamics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-social-networks-lectures",
                sections: "https://drive.google.com/drive/folders/intro-social-networks-sections",
                videos: "https://youtube.com/playlist?list=intro-social-networks-videos",
                summaries: "https://drive.google.com/drive/folders/intro-social-networks-summaries",
                exams: "https://drive.google.com/drive/folders/intro-social-networks-lastexam",
              },
            },
            {
              id: "simulations",
              name: "Simulations",
              code: "02-24-01403",
              description: "Monte Carlo methods and simulation techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/simulations-lectures",
                sections: "https://drive.google.com/drive/folders/simulations-sections",
                videos: "https://youtube.com/playlist?list=simulations-videos",
                summaries: "https://drive.google.com/drive/folders/simulations-summaries",
                exams: "https://drive.google.com/drive/folders/simulations-lastexam",
              },
            },
            {
              id: "program-elective-1",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-1-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-1-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-1-lastexam",
              },
            },
            {
              id: "program-elective-2",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-2-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-2-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-2-lastexam",
              },
            },
            {
              id: "university-elective-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "Elective course from university-wide offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-4-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-4-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-4-lastexam",
              },
            },
          ],
          term2: [
            {
              id: "social-data-analytics",
              name: "Social Data Analytics",
              code: "02-24-01405",
              description: "Analysis of social media and behavioral data",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/social-data-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/social-data-analytics-sections",
                videos: "https://youtube.com/playlist?list=social-data-analytics-videos",
                summaries: "https://drive.google.com/drive/folders/social-data-analytics-summaries",
                exams: "https://drive.google.com/drive/folders/social-data-analytics-lastexam",
              },
            },
            {
              id: "distributed-data-analysis",
              name: "Distributed Data Analysis",
              code: "02-24-01406",
              description: "Parallel and distributed computing for data analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/distributed-data-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/distributed-data-analysis-sections",
                videos: "https://youtube.com/playlist?list=distributed-data-analysis-videos",
                summaries: "https://drive.google.com/drive/folders/distributed-data-analysis-summaries",
                exams: "https://drive.google.com/drive/folders/distributed-data-analysis-lastexam",
              },
            },
            {
              id: "stream-processing",
              name: "Stream Processing",
              code: "02-24-01407",
              description: "Real-time data processing and streaming analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/stream-processing-lectures",
                sections: "https://drive.google.com/drive/folders/stream-processing-sections",
                videos: "https://youtube.com/playlist?list=stream-processing-videos",
                summaries: "https://drive.google.com/drive/folders/stream-processing-summaries",
                exams: "https://drive.google.com/drive/folders/stream-processing-lastexam",
              },
            },
            {
              id: "program-elective-3",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-3-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-3-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-3-lastexam",
              },
            },
            {
              id: "program-elective-4",
              name: "Program Elective",
              code: "02-24-014XX",
              description: "Specialized program elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-4-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-4-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-4-lastexam",
              },
            },
            {
              id: "university-elective-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "Elective course from university-wide offerings",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-5-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-5-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-5-lastexam",
              },
            },
          ],
        },
      },
    },
  },
  "business-analytics": {
    name: "Business Analytics",
    description: "Data-driven business intelligence and analytics for strategic decision making",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-ba",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations of linear algebra for data science applications",
              creditHours: 3,
              prerequisites: [],
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yFYYS37ERUHG6Ft_HnC17Jmgo-Zsrg06?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/191trjdbwAtjG6yz65q-C1Hd3gigqoti7?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLvuToPs04FnD1lFBolGr4ROQaxQ_zyC1c&si=6IWNZY0eY_ymFdAq"] ,
                exams: "https://drive.google.com/drive/folders/1vUbUjWsbexiPgjDbJOuh-N43PVDc9hjc?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/150zP5Dc9vDKzazlm37IRttDG-_b-opK1?usp=drive_link"
              },
            },
            {
              id: "calculus-ba",
              name: "Calculus",
              code: "02-24-00102",
              description: "Differential and integral calculus with applications in computing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1LsWVrCXpwVsL7YhGL_QFQhyryvpc_Yon?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1U2LbrtWkf-X8DL3c7Yo12kgV8bbZ0Wb6?usp=drive_link",
                videos: '',
                exams: "https://drive.google.com/drive/folders/1Uf7LaRzQyqxEbTVG0dfmWFzTxmZNHLvB?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1UkJQ6mJmcSb_MTbzT_8liJZTUMCOLARt?usp=drive_link"
              },
            },
            {
              id: "intro-computer-systems-ba",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Fundamentals of computer architecture and system organization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yQK4QiXQ7e7Ui6DLMAGYQa3aTuQp0v9O?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1q0iRgXguAaa2zZTSA9J1smnCwN2PwCAn?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLskaQRgiRMYb0SqvJ-wKx2n4Q3CB5uQ8e&si=wXANl6gRLW404zuP"],
                summaries: "https://drive.google.com/drive/folders/1RFPXNiitr2yiHr1AyCsZWuTX0rYyOwIL?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1hTVXduWW2Icy8HY-uOc5lEiUUM42RSkB?usp=drive_link",
                quizzes: [
                  {
                    id: "CS_001",
                    name: "Chapter 1 : Introduction to Computer Systems",
                    code: "CS_001",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_001.json"
                  },
                  {
                    id: "CS_002",
                    name: "Chapter 2 : Processing and Memory Management",
                    code: "CS_002",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_002.json"
                  },
                  {
                    id: "CS_003",
                    name: "Chapter 3 : Storage",
                    code: "CS_003",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_003.json"
                  },
                  {
                    id: "CS_004",
                    name: "Chapter 4 : Input and Output",
                    code: "CS_004",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_004.json"
                  },
                  {
                    id: "CS_005",
                    name: "Chapter 5 : System Software",
                    code: "CS_005",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_005.json"
                  },
                  {
                    id: "CS_006",
                    name: "Chapter 6 : Applications Software (1/2)",
                    code: "CS_006",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_006.json"
                  }
                  ,{
                    id: "CS_007",
                    name: "Chapter 6 : Applications Software (2/2)",
                    code: "CS_007",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_007.json"
                  }
                  ,{
                    id: "CS_008",
                    name: "Chapter 7 : Computer Networks",
                    code: "CS_008",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_008.json"
                  },
                  {
                    id: "CS_009",
                    name: "Chapter 13 : Program Dev & Programming Languages",
                    code: "CS_009",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_009.json"
                  },
                  {
                    id: "CS_010",
                    name: "Converting Binary to Decimal and Vice Versa",
                    code: "CS_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_010.json"
                  },
                  {
                    id: "CS_011",
                    name: "Converting Binary to Octal and Vice Versa",
                    code: "CS_011",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_011.json"
                  },
                  {
                    id: "CS_012",
                    name: "Converting Binary to Hexadecimal and Vice Versa",
                    code: "CS_012",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_012.json"
                  },
                  {
                    id: "CS_013",
                    name: "Converting Decimal to Octal and Vice Versa",
                    code: "CS_013",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_013.json"
                  },
                  {
                    id: "CS_014",
                    name: "Converting Decimal to Hexadecimal and Vice Versa",
                    code: "CS_014",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_014.json"
                  },
                  {
                    id: "CS_015",
                    name: "Converting Octal to Hexadecimal and Vice Versa",
                    code: "CS_015",
                    duration: "OP",
                    questions: 10,
                    jsonFile: "/quizzes/Computer System/CS_015.json"
                  },
                  {
                    id: "CS_016",
                    name: "Converting Gray Code to Binary and Vice Versa",
                    code: "CS_016",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_016.json"
                  },
                  {
                    id: "CS_017",
                    name: "Converting BCD to Decimal and Vice Versa",
                    code: "CS_017",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_017.json"
                  }
                ],
              },
            },
            {
              id: "intro-data-sciences-ba",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Overview of data science concepts, tools, and methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10SsZONPzWccvjTQB4ZcHmT0j_FU8b981?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14IwWgXRgD8G2IPJ2op1RdBIj9pgs77LJ?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLNVsyemi1cQyXLWT3vm4GbWzVxAK_4nbR&si=Q7kxeMYT4iXhr2uC"],
                summaries: "https://drive.google.com/drive/folders/13IFz-O_64Ga8y9TyFe13CSovw0xzxdUQ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1adpsd15n6hieC29aQECkrftCHNz20U9c?usp=drive_link",
                quizzes: [
                  {
                    id: "DS_001",
                    name: "Lecture 1 - Introduction to Data Science",
                    code: "DS_001",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_001.json"
                  },
                  {
                    id: "DS_002",
                    name: "Lecture 2 - Big Data",
                    code: "DS_002",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_002.json"
                  },
                  {
                    id: "DS_003",
                    name: "Lecture 3 - Data Analytics lifecycle (Characters)",
                    code: "DS_003",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_003.json"
                  },
                  {
                    id: "DS_004",
                    name: "Lecture 4 - Data Analytics lifecycle (Phases)",
                    code: "DS_004",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_004.json"
                  },
                  {
                    id: "DS_005",
                    name: "Lecture 5 - Clustering Analysis",
                    code: "DS_005",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_005.json"
                  },
                  {
                    id: "DS_006",
                    name: "Lecture 6 - Introduction Association Rules (1/2)",
                    code: "DS_006",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_006.json"
                  },
                  {
                    id: "DS_007",
                    name: "Lecture 7 - Introduction Association Rules (2/2)",
                    code: "DS_007",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_007.json"
                  },
                  {
                    id: "DS_008",
                    name: "Lecture 8 - Data Visualization",
                    code: "DS_008",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_008.json"
                  },
                  {
                    id: "DS_009",
                    name: "Lecture 9 - Classification Analysis",
                    code: "DS_009",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_009.json"
                  },
                  {
                    id: "DS_010",
                    name: "Lecture 10 - Decision Trees",
                    code: "DS_010",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_010.json"
                  }
                ],
              },
            },
            {
              id: "programming-1-ba",
              name: "Programming I",
              code: "02-24-00105",
              description: "Introduction to programming concepts and problem-solving techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1VDUvvvKoRcBfdCAgdO5GUa8ourGzEj43?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14-W3wcsn8gw2ym8CnIo_L6jh0RfQW-mR?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AajYlZGzU_LVrHdoouf8W6ZN&si=_3EUjHYYQd7xAuGr", "https://youtube.com/playlist?list=PL1DUmTEdeA6K7rdxKiWJq6JIxTvHalY8f&si=wl8ryBAWTyTatxTw"],
                summaries: "https://drive.google.com/drive/folders/19GRYDzueyRIB45_CJGn9Qh3_3JkIgfQH?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1wT8Ad9IGifK4NMgE71xXzLhXs4FF0wuc?usp=drive_link",
                quizzes: [
                  {
                    id: "PR1_30001",
                    name: "Chapter 1 : Introduction to Programming",
                    code: "PR1_30001",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30001.json"
                  },
                  {
                    id: "PR1_30002",
                    name: "Chapter 2-1 : Introduction to Java Programming",
                    code: "PR1_30002",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30002.json"
                  },
                  {
                    id: "PR1_30003",
                    name: "Chapter 2-2 : Java Basics",
                    code: "PR1_30003",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30003.json"
                  },
                  {
                    id: "PR1_30004",
                    name: "Chapter 2-3 : Java Basics",
                    code: "PR1_30004",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30004.json"
                  },
                  {
                    id: "PR1_30005",
                    name: "Chapter 2-4 : Deep Dive into Java",
                    code: "PR1_30005",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30005.json"
                  },
                  {
                    id: "PR1_30006",
                    name: "Chapter 3-1 : Controlling Program Flow",
                    code: "PR1_30006",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30006.json"
                  },
                  {
                    id: "PR1_30007",
                    name: "Chapter 3-2 : Controlling Program Flow",
                    code: "PR1_30007",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30007.json"
                  },
                  {
                    id: "PR1_30008",
                    name: "Chapter 4-1 : One Dimensional Arrays",
                    code: "PR1_30008",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30008.json"
                  },
                  {
                    id: "PR1_30009",
                    name: "Chapter 4-2 : Multi Dimensional Arrays",
                    code: "PR1_30009",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30009.json"
                  },
                  {
                    id: "PR1_30010",
                    name: "Review 1",
                    code: "PR1_30010",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30010.json"
                  },
                  {
                    id: "PR1_30011",
                    name: "Review 2",
                    code: "PR1_30011",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30011.json"
                  },
                  {
                    id: "PR1_30012",
                    name: "Tracing and Debugging",
                    code: "PR1_30012",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30012.json"
                  },
                ],
              
              },
            },
            {
              id: "critical-thinking-ba",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Development of analytical and critical thinking skills",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1mGHqF_BIXdX-S6BipXm942CsOvr6WHTG?usp=drive_link",
                sections: '',
                videos: ["https://youtube.com/playlist?list=PL2y4AZEEnQLmigukmMl5lD0CkewT1pBQ3&si=GijvUZQgn4vO1gdR"],
                summaries: "https://drive.google.com/drive/folders/1He5H59nOzExcoG5GYaujPWQVnKTZwD2Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ZfnkRMneHYU5wYlq4738XZt1NvGlRbt6?usp=drive_link"
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-ba",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Fundamental concepts of probability theory and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/14WxYDv-3V5hBNF2FTrLEKkZpPQJjwyUb?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yy9aqzmJsEDZasn2VT1nfzIdJoajEf6F?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PL7snZ0LSsq3g9NUio7xFDtC9IVIj649GV","https://youtube.com/playlist?list=PLXCWPoTuIpYbXgbNuQkBHlMwjK6DpnQ3l"],
                summaries: "https://drive.google.com/drive/folders/1CmL8lOIlbHdYCAhNa5cJSbDSTGEJVdMt?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1reVZYtR8aOBqpHY8PSn2vmwVwNCS_nQC?usp=drive_link"
              },
            },
            {
              id: "discrete-structures-ba",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures and logic for computer science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/12dEJoHHZhCBjBG1KiV2T92HLsGRtDIn8?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1KnWe1Ciq3ETioGCIApu89Sc3Y1FvEgIO?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLxIvc-MGOs6gZlMVYOOEtUHJmfUquCjwz",
                summaries: "https://drive.google.com/drive/folders/1sqiDSQMkoYZCehzIgdyxZcNRSYpIkLnX?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1SgzQqrBfbam-yqOw8xOdq9SKXPlScR2k?usp=drive_link",
                quizzes: [
                  {
                    id: "DM_001",
                    name: "Intro to Discrete Math",
                    code: "DM_001",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_001.json"
                  },
                  {
                    id: "DM_002",
                    name: "Bit Operations",
                    code: "DM_002",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_002.json"
                  },
                  {
                    id: "DM_003",
                    name: "Predicates and Quantifiers",
                    code: "DM_003",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_003.json"
                  },
                  {
                    id: "DM_004",
                    name: "Sets and Functions",
                    code: "DM_004",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_004.json"
                  },
                  {
                    id: "DM_005",
                    name: "Set Operations",
                    code: "DM_005",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_005.json"
                  },
                  {
                    id: "DM_006",
                    name: "Functions Domain",
                    code: "DM_006",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_006.json"
                  },
                  {
                    id: "DM_007",
                    name: "Product Rule",
                    code: "DM_007",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_007.json"
                  },
                  {
                    id: "DM_008",
                    name: "Password Counting",
                    code: "DM_008",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_008.json"
                  },
                  {
                    id: "DM_009",
                    name: "Permutations Combinations",
                    code: "DM_009",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_009.json"
                  },
                ]
              },
            },
            {
              id: "data-structures-algorithms-ba",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Fundamental data structures and algorithmic problem-solving",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1U2vmhFrPOs46SZk-rNdzE4yrCIPL5Qow?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1nr2Og9PqyiRYGl7jFJOtgZx1LGZfeHvY?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp",
                summaries: "https://drive.google.com/drive/folders/1Oiki77OjApABjz0z7D3j2g-Kxc7-hN59?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1IADSkBhDhvgjpDJecfTf9VlvdoJ9P2hD?usp=drive_link",
                quizzes: [
                  {
                    id: "STR_001",
                    name: "Introduction to Data Structures",
                    code: "STR_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_001.json"
                  },
                  {
                    id: "STR_002",
                    name: "Singly Linked List",
                    code: "STR_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_002.json"
                  },
                  {
                    id: "STR_003",
                    name: "Doubly Linked List",
                    code: "STR_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_003.json"
                  },
                  {
                    id: "STR_004",
                    name: "Hash Table",
                    code: "STR_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_004.json"
                  },
                  {
                    id: "STR_005",
                    name: "Stack - Queue - PQ",
                    code: "STR_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_005.json"
                  },
                  {
                    id: "STR_006",
                    name: "BST (Binary Search Tree)",
                    code: "STR_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_006.json"
                  },
                  {
                    id: "STR_007",
                    name: "Sorting Algorithms",
                    code: "STR_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_007.json"
                  },
                  {
                    id: "STR_008",
                    name: "Heap Tree",
                    code: "STR_008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_008.json"
                  },
                  {
                    id: "STR_009",
                    name: "General Review (Part 1)",
                    code: "STR_009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_009.json"
                  },
                  {
                    id: "STR_010",
                    name: "General Review (Part 2)",
                    code: "STR_010",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_010.json"
                  },
                ]
              },
            },
            {
              id: "intro-artificial-intelligence-ba",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Basic concepts and applications of artificial intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1tp-If4eJhcAY4dIzgSieKIj3YVdSF-8m?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYXjZlFJL8FfAKoyhDbshpwwLVBN700R?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1RaS9fI4MaHKg_Bxs_GgyYE_LVuaG3kaJ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1jjGy4TJ8EbON_k0hf2exQNQtQx2KR4wr?usp=drive_link"
              },
            },
            {
              id: "programming-2-ba",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming concepts and software development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yiF9hcqLqa-wyKfEzdiWDF0bR4A_VtK2?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1geGGbmFKJYIN1yvyIskEeRyI0Y8zWhpU?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AagY7fFlhCrjpLiIFybW3yQv","https://youtube.com/playlist?list=PL1DUmTEdeA6Icttz-O9C3RPRF8R8Px5vk"],
                summaries: "https://drive.google.com/drive/folders/1VGGZWwQmZdVD8LWI6piI_RzQqdwKq_st?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1dxwniB91RAEtAu0hKLt5cWqb3t1Q0FLI?usp=drive_link",
                quizzes: [
                  {
                    id: "PR2_50001",
                    name: "Functions - Methods (Part 1)",
                    code: "PR2_50001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50001.json"
                  },
                  {
                    id: "PR2_50002",
                    name: "Functions - Methods (Part 2)",
                    code: "PR2_50002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50002.json"
                  },
                  {
                    id: "PR2_50003",
                    name: "Introduction To Object-Oriented Programming",
                    code: "PR2_50003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50003.json"
                  },
                  {
                    id: "PR2_50004",
                    name: "Constructor and It's Types",
                    code: "PR2_50004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50004.json"
                  },
                  {
                    id: "PR2_50005",
                    name: "Inheritance and Polymorphism (Part 1)",
                    code: "PR2_50005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50005.json"
                  },
                  {
                    id: "PR2_50006",
                    name: "Inheritance and Polymorphism (Part 2)",
                    code: "PR2_50006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50006.json"
                  },
                  {
                    id: "PR2_50007",
                    name: "Abstract Class and Interface",
                    code: "PR2_50007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50007.json"
                  },
                  {
                    id: "PR2_50008",
                    name: "Class Relations (Part 1)",
                    code: "PR2_50008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50008.json"
                  },
                  {
                    id: "PR2_50009",
                    name: "Class Relations (Part 2)",
                    code: "PR2_50009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50009.json"
                  },
                  {
                    id: "PR2_50010",
                    name: "Array List in Java",
                    code: "PR2_50010",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50010.json"
                  },
                  {
                    id: "PR2_50011",
                    name: "Exception Handling",
                    code: "PR2_50011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50011.json"
                  },
                  {
                    id: "PR2_50012",
                    name: "Static Keyword and Static Methods",
                    code: "PR2_50012",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50012.json"
                  },
                  {
                    id: "PR2_50013",
                    name: "Recursive Methods and Recursion Concept",
                    code: "PR2_50013",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50013.json"
                  },
                ],
              },
            },
            {
              id: "innovation-entrepreneurship-ba",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Principles of innovation and entrepreneurial thinking",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1aEPdYTJoeTy0QhS3j1YE3GnJsjIs_8ij?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1n1AWZVhnH-Hr_8xmF8PiHdzTHYLGIsRa?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1MxzGEcFlQuweR0XHi7zuBMDuIfn00tcZ?usp=drive_link"
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-ba",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistical methods and probability distributions",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Cat1L5ibgjDAx3qcU8XpKuM2Sp0jIWdA?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/17m-plzdlLyhkjM_TFmcYw5AZyC61yNrx?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL7snZ0LSsq3g6KzD6pdqwU3_Do8WPY4M8&si=1ZMtkTPNNIX7q31M",
                summaries: "https://drive.google.com/drive/folders/1z2c94GAfxG4TdX63ZY_rZSicvEZlrRHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1QRMaP_UgieJRGo5ebwvD_bIu9EMF0SYs?usp=drive_link"
              },
            },
            {
              id: "intro-databases-ba",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database design, implementation, and management principles",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10DIqel1WkLIg5YZ1qbT604vRdpVPyLZ6?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1a78X1gWfKKui7qrsGkHvwycayAssG8Le?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL37D52B7714788190&si=9Qkf5KQWLTXqYKt1",
                summaries: "https://drive.google.com/drive/folders/1vMRqmZ7ID3YIT920N6loq_yJKOQSOG65?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1luaj1L4qB2T3hTcQvwra667abVRXOx9c?usp=drive_link"
              },
            },
            {
              id: "numerical-computations-ba",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods and computational techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1YerbhXBHp9cLVhuBlsp337xKVS_01139?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1K4WIBD41wo7MP_GwXpo6yfEg-93c2wVM?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1WbNyHrPMQg8aBKK3pEUvBplv7gxzsxHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/14RRGt31M6KSQAxypsDQ2sMI_DR939Wy5?usp=drive_link"
              },
            },
            {
              id: "advanced-calculus-ba",
              name: "Advanced Calculus",
              code: "02-24-01201",
              description: "Multivariable calculus and advanced mathematical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1kMuGgdNfirnO_HP6CYKL02-LRJXjpgfh?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/19elXC7fQOQASSTk2cG9pa2GVU1i4gFW3?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1iGMlitjUbTAe-PAr1Gm7ftOqMQjbmjvV?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1NlpAB2MaIloRaoBeiNG2qiZagRn8EYPU?usp=drive_link"
              },
            },
            {
              id: "data-science-methodology-ba",
              name: "Data Science Methodology",
              code: "02-24-01202",
              description: "Systematic approaches to data science projects and research",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1euOjkcK23yHHMKwvx6zOJiPgrj7-m09k?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1C14zdESIjWhVfxFXP5eDsGY5D290Mu6Z?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1G_XU_TmlwWBKyhFUOj0L055GBsTfniJT?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1_PCpSjwGN8wHeO_uB0bthGi6iDcI5AsI?usp=drive_link"
              },
            },
            {
              id: "university-elective-1-ba",
              name: "Economy Science",
              code: "HE_005",
              description: "Study of economic principles and their applications",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1_Z4FSE1Dx0oJ9_nxbHoFvn1WP2wN-Iyd?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1LuCRHkTxVc_uKOX7SdVEwcc0WrEL-n2D?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1B_bMKIcqQ4t_PsxDR6-GMUWQOv67AvNK?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1qI0ElMk-nNfGv8hH9h3M51Mz9KvEKhIZ?usp=drive_link",
                quizzes: [
                  {
                    id: "ECO_001",
                    name: "الفصل الاول - مقدمة في علم الاقتصاد",
                    code: "ECO_001",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_001.json"
                  },
                  {
                    id: "ECO_002",
                    name: "الفصل الثاني -المشكلة الاقتصادية والنظم الاقتصادية",
                    code: "ECO_002",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_002.json"
                  },
                  {
                    id: "ECO_003",
                    name: "الفصل الثالث - نظرية طلب المستهلك",
                    code: "ECO_003",
                    duration: "OP",
                    questions: 19,
                    jsonFile: "/quizzes/Economic/ECO_003.json"
                  },
                  {
                    id: "ECO_004",
                    name: "الفصل الرابع - العرض في السوق",
                    code: "ECO_004",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_004.json"
                  },
                  {
                    id: "ECO_005",
                    name: "الفصل الخامس - التوازن في السوق",
                    code: "ECO_005",
                    duration: "OP",
                    questions: 12,
                    jsonFile: "/quizzes/Economic/ECO_005.json"
                  },
                  {
                    id: "ECO_006",
                    name: "الفصل السادس - مرونات العرض والطلب",
                    code: "ECO_006",
                    duration: "OP",
                    questions: 27,
                    jsonFile: "/quizzes/Economic/ECO_006.json"
                  },
                  {
                    id: "ECO_007",
                    name: "الفصل السابع - نظرية المنفعة الحدية",
                    code: "ECO_007",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_007.json"
                  },
                  {
                    id: "ECO_008",
                    name: "الفصل التاسع - نظرية الإنتاج",
                    code: "ECO_008",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_008.json"
                  },
                  {
                    id: "ECO_009",
                    name: "الفصل العاشر - تكاليف الإنتاج",
                    code: "ECO_009",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_009.json"
                  },
                  {
                    id: "ECO_010",
                    name: "الفصل الحادي عشر - اسواق المنافسة الكاملة",
                    code: "ECO_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_010.json"
                  },
                  {
                    id: "ECO_011",
                    name: "الفصل الثاني عشر - اسواق المنافسة غير الكاملة",
                    code: "ECO_011",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_011.json"
                  },
                ],
              },
            },
            {
              id: "intro-business",
              name: "Introduction to Business",
              code: "02-24-02201",
              description: "Fundamentals of business operations and management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1EHeFukmbY41Byh0ICRdOYeGEGlRFOjre?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1t4KpjfxW5gbLGby0sIB-q8jQwUHFP4N0?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1hn-uMnhuaCRvLBDRrgzr4MIHEH6m-K0H?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1gzE-EwAi10rdxc6WIUYrrZR-tLOAnvid?usp=drive_link"
              },
            },
            {
              id: "accounting-information-systems",
              name: "Accounting as an Information Systems",
              code: "02-24-02202",
              description: "Accounting principles and information systems integration",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/16Ky0uBqcK_qLTTwt4H2kLR_OuqgqvQv-?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/17rp47Vi0r6ORxAjsaHNnGBFqoeez0J_I?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/11GR8XB5TldP3B9S07T6V70-LURnmTAv2?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/18f3nr-TvK01abgOtBZ1lZDwgrMf1E832?usp=drive_link"
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-ba",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms, services, and distributed computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1P37WAFRKgkokNwr6R5MZNOFEpff5dUIB?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1ny-TP92zjTZrctHIBx_QmsTfl52bSP1Q?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/11QHqhN6G_OmTNZTPdR_OVWzUZ5fEMO8X?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ICXoWQy7-nas1_KaLNCA_fHKXEVvRqw2?usp=drive_link",
                quizzes: [
                  {
                    id: "CLC_10661",
                    name: "Introduction to Cloud Computing",
                    code: "CLC_10661",
                    duration: "OP", // <-- CHANGED THIS LINE
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10661.json"
                  },
                  {
                    id: "CLC_10662",
                    name: "Platform and Infrastructure Services",
                    code: "CLC_10662",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10662.json"
                  },
                  {
                    id: "CLC_10663",
                    name: "Virtualization",
                    code: "CLC_10663",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10663.json"
                  },
                  {
                    id: "CLC_10664",
                    name: "Parallel Programming",
                    code: "CLC_10664",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10664.json"
                  },
                  {
                    id: "CLC_10665",
                    name: "Distributed Storage Systems",
                    code: "CLC_10665",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10665.json"
                  },
                  {
                    id: "CLC_10666",
                    name: "Cloud Security",
                    code: "CLC_10666",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10666.json"
                  },
                  {
                    id: "CLC_10667",
                    name: "Cloud Performance",
                    code: "CLC_10667",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10667.json"
                  },
                  {
                    id: "CLC_10668",
                    name: "General Overview + 20Q of 2025's Midterm",
                    code: "CLC_10668",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10668_TOT.json"
                  }
                ],
              },
            },
            {
              id: "machine-learning-ba",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Supervised and unsupervised learning algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1CCeA8VUvw__jCBmZ-5Y1J3ujOyir4HSr?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1hO_vvmFpCD9zw4rlK77HIIeNVWpjgM2K?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1XdboKP5n65WZCznnqiCrE0BZfiarSl4Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1WI08MEt_kVSuMITdlqqgPaVpTUPwiqgK?usp=drive_link"
              },
            },
            {
              id: "data-mining-analytics-ba",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Techniques for extracting knowledge from large datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Ex-VAzuroLcg0fmSmg-Zd-x6KXCY7P1H?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yRLzmfdAksXPomOZCRLQLG48sWnkQIDc?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1HRedV6Iu8Djd_f0AE0MigL8nKoq8Yb8-?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1mrKwfr3Mgi9p3zp7VdIVLmsUiPYhJYCX?usp=drive_link",
                quizzes:[
                  {
                    id: "MIG_14331",
                    name: "Data Mining Lecture 1",
                    code: "MIG_14331",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14331.json"
                  },
                  {
                    id: "MIG_14332",
                    name: "Data Mining Lecture 2",
                    code: "MIG_14332",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14332.json"
                  },
                  {
                    id: "MIG_14333",
                    name: "Data Mining Lecture 3",
                    code: "MIG_14333",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14333.json"
                  },
                  {
                    id: "MIG_14334",
                    name: "Data Mining Lecture 4",
                    code: "MIG_14334",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14334.json"
                  },
                  {
                    id: "MIG_14335",
                    name: "Data Mining Lecture 5",
                    code: "MIG_14335",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14335.json"
                  },
                  {
                    id: "MIG_14336",
                    name: "Data Mining Lecture 6",
                    code: "MIG_14336",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14336.json"
                  },
                ]
              },
            },
            {
              id: "system-analysis-design",
              name: "System Analysis & Design",
              code: "02-24-02203",
              description: "Business system analysis and design methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/system-analysis-design-lectures",
                sections: "https://drive.google.com/drive/folders/system-analysis-design-sections",
                videos: "https://youtube.com/playlist?list=system-analysis-design-videos",
                summaries: "https://drive.google.com/drive/folders/system-analysis-design-summaries",
                exams: "https://drive.google.com/drive/folders/system-analysis-design-lastexam"
              },
            },
            {
              id: "financial-planning-analysis",
              name: "Financial Planning and Analysis",
              code: "02-24-02204",
              description: "Financial planning and analytical techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/financial-planning-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/financial-planning-analysis-sections",
                videos: "https://youtube.com/playlist?list=financial-planning-analysis-videos",
                summaries: "https://drive.google.com/drive/folders/financial-planning-analysis-summaries",
                exams: "https://drive.google.com/drive/folders/financial-planning-analysis-lastexam"
              },
            },
            {
              id: "university-elective-ba-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-2-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-ba-2-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-ba-2-lastexam"
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "business-process-modeling",
              name: "Business Process Modeling and Integration",
              code: "02-24-02301",
              description: "Business process analysis and integration strategies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/business-process-modeling-lectures",
                sections: "https://drive.google.com/drive/folders/business-process-modeling-sections",
                videos: "https://youtube.com/playlist?list=business-process-modeling-videos",
                summaries: "https://drive.google.com/drive/folders/business-process-modeling-summaries",
                exams: "https://drive.google.com/drive/folders/business-process-modeling-lastexam"
              },
            },
            {
              id: "quantitative-analysis",
              name: "Quantitative Analysis",
              code: "02-24-02302",
              description: "Quantitative methods for business decision making",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/quantitative-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/quantitative-analysis-sections",
                videos: "https://youtube.com/playlist?list=quantitative-analysis-videos",
                summaries: "https://drive.google.com/drive/folders/quantitative-analysis-summaries",
                exams: "https://drive.google.com/drive/folders/quantitative-analysis-lastexam"
              },
            },
            {
              id: "data-warehousing-bi",
              name: "Data Warehousing & Business Intelligence",
              code: "02-24-02303",
              description: "Data warehousing and business intelligence systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-warehousing-bi-lectures",
                sections: "https://drive.google.com/drive/folders/data-warehousing-bi-sections",
                videos: "https://youtube.com/playlist?list=data-warehousing-bi-videos",
                summaries: "https://drive.google.com/drive/folders/data-warehousing-bi-summaries",
                exams: "https://drive.google.com/drive/folders/data-warehousing-bi-lastexam"  
              },
            },
            {
              id: "faculty-elective-ba-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-1-videos",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-ba-1-summaries",
                exams: "https://drive.google.com/drive/folders/faculty-elective-ba-1-lastexam"
              },
            },
            {
              id: "faculty-elective-ba-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-2-videos",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-ba-2-summaries",
              },
            },
            {
              id: "university-elective-ba-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-3-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-ba-3-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-ba-3-lastexam"
              },
            },
          ],
          term2: [
            {
              id: "data-visualization-ba",
              name: "Data Visualization",
              code: "02-24-02304",
              description: "Advanced data visualization techniques for business",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-visualization-ba-lectures",
                sections: "https://drive.google.com/drive/folders/data-visualization-ba-sections",
                videos: "https://youtube.com/playlist?list=data-visualization-ba-videos",
                summaries: "https://drive.google.com/drive/folders/data-visualization-ba-summaries",
                exams: "https://drive.google.com/drive/folders/data-visualization-ba-lastexam"
              },
            },
            {
              id: "enterprise-information-systems",
              name: "Enterprise Information Systems",
              code: "02-24-02305",
              description: "Enterprise-level information system design and management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/enterprise-information-systems-lectures",
                sections: "https://drive.google.com/drive/folders/enterprise-information-systems-sections",
                videos: "https://youtube.com/playlist?list=enterprise-information-systems-videos",
                summaries: "https://drive.google.com/drive/folders/enterprise-information-systems-summaries",
                exams: "https://drive.google.com/drive/folders/enterprise-information-systems-lastexam"
              },
            },
            {
              id: "data-driven-marketing",
              name: "Data Driven Marketing",
              code: "02-24-02306",
              description: "Marketing analytics and data-driven marketing strategies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-driven-marketing-lectures",
                sections: "https://drive.google.com/drive/folders/data-driven-marketing-sections",
                videos: "https://youtube.com/playlist?list=data-driven-marketing-videos",
                summaries: "https://drive.google.com/drive/folders/data-driven-marketing-summaries",
                exams: "https://drive.google.com/drive/folders/data-driven-marketing-lastexam"
              },
            },
            {
              id: "faculty-elective-ba-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-3-videos",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-ba-3-summaries",
                exams: "https://drive.google.com/drive/folders/faculty-elective-ba-3-lastexam"
              },
            },
            {
              id: "faculty-elective-ba-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ba-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ba-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ba-4-videos",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-ba-4-summaries",
                exams: "https://drive.google.com/drive/folders/faculty-elective-ba-4-lastexam"
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "leadership-people-analytics",
              name: "Leadership and People Analytics",
              code: "02-24-02401",
              description: "Analytics for human resources and leadership development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/leadership-people-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/leadership-people-analytics-sections",
                videos: "https://youtube.com/playlist?list=leadership-people-analytics-videos",
                exams: "https://drive.google.com/drive/folders/leadership-people-analytics-lastexam",
                summaries: "https://drive.google.com/drive/folders/leadership-people-analytics-summaries"
              },
            },
            {
              id: "data-it-governance",
              name: "Data and IT Governance",
              code: "02-24-02402",
              description: "Governance frameworks for data and IT management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-it-governance-lectures",
                sections: "https://drive.google.com/drive/folders/data-it-governance-sections",
                videos: "https://youtube.com/playlist?list=data-it-governance-videos",
                summaries: "https://drive.google.com/drive/folders/data-it-governance-summaries",
                exams: "https://drive.google.com/drive/folders/data-it-governance-lastexam"
              },
            },
            {
              id: "information-retrieval",
              name: "Information Retrieval",
              code: "02-24-02403",
              description: "Information retrieval systems and search technologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/information-retrieval-lectures",
                sections: "https://drive.google.com/drive/folders/information-retrieval-sections",
                videos: "https://youtube.com/playlist?list=information-retrieval-videos",
                summaries: "https://drive.google.com/drive/folders/information-retrieval-summaries",
                exams: "https://drive.google.com/drive/folders/information-retrieval-lastexam"
              },
            },
            {
              id: "program-elective-ba-1",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-1-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-ba-1-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-ba-1-lastexam"
              },
            },
            {
              id: "program-elective-ba-2",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-2-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-ba-2-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-ba-2-lastexam"
              },
            },
            {
              id: "university-elective-ba-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-4-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-ba-4-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-ba-4-lastexam"
              },
            },
          ],
          term2: [
            {
              id: "text-social-media-mining",
              name: "Text and Social Media Mining",
              code: "02-24-02405",
              description: "Mining and analysis of text and social media data",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/text-social-media-mining-lectures",
                sections: "https://drive.google.com/drive/folders/text-social-media-mining-sections",
                videos: "https://youtube.com/playlist?list=text-social-media-mining-videos",
                summaries: "https://drive.google.com/drive/folders/text-social-media-mining-summaries",
                exams: "https://drive.google.com/drive/folders/text-social-media-mining-lastexam"
              },
            },
            {
              id: "logistics-supply-chain-analytics",
              name: "Logistics and Supply Chain Analytics",
              code: "02-24-02406",
              description: "Analytics for logistics and supply chain optimization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/logistics-supply-chain-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/logistics-supply-chain-analytics-sections",
                videos: "https://youtube.com/playlist?list=logistics-supply-chain-analytics-videos",
                summaries: "https://drive.google.com/drive/folders/logistics-supply-chain-analytics-summaries",
                exams: "https://drive.google.com/drive/folders/logistics-supply-chain-analytics-lastexam"
              },
            },
            {
              id: "it-laws-ethics",
              name: "Information Technology Laws and Ethics",
              code: "02-24-02407",
              description: "Legal and ethical aspects of information technology",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/it-laws-ethics-lectures",
                sections: "https://drive.google.com/drive/folders/it-laws-ethics-sections",
                videos: "https://youtube.com/playlist?list=it-laws-ethics-videos",
                summaries: "https://drive.google.com/drive/folders/it-laws-ethics-summaries",
                exams: "https://drive.google.com/drive/folders/it-laws-ethics-lastexam"
              },
            },
            {
              id: "program-elective-ba-3",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-3-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-ba-3-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-ba-3-lastexam"
              },
            },
            {
              id: "program-elective-ba-4",
              name: "Program Elective",
              code: "02-24-024XX",
              description: "Specialized business analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ba-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ba-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ba-4-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-ba-4-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-ba-4-lastexam"
              },
            },
            {
              id: "university-elective-ba-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ba-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ba-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ba-5-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-ba-5-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-ba-5-lastexam"
              },
            },
          ],
        },
      },
    },
  },
  "artificial-intelligence": {
    name: "Intelligent Systems",
    description: "Advanced AI systems, machine learning, and intelligent automation technologies",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-is",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations of linear algebra for data science applications",
              creditHours: 3,
              prerequisites: [],
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yFYYS37ERUHG6Ft_HnC17Jmgo-Zsrg06?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/191trjdbwAtjG6yz65q-C1Hd3gigqoti7?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLvuToPs04FnD1lFBolGr4ROQaxQ_zyC1c&si=6IWNZY0eY_ymFdAq"] ,
                exams: "https://drive.google.com/drive/folders/1vUbUjWsbexiPgjDbJOuh-N43PVDc9hjc?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/150zP5Dc9vDKzazlm37IRttDG-_b-opK1?usp=drive_link"
              },
            },
            {
              id: "calculus-is",
              name: "Calculus",
              code: "02-24-00102",
              description: "Differential and integral calculus with applications in computing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1LsWVrCXpwVsL7YhGL_QFQhyryvpc_Yon?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1U2LbrtWkf-X8DL3c7Yo12kgV8bbZ0Wb6?usp=drive_link",
                videos: '',
                exams: "https://drive.google.com/drive/folders/1Uf7LaRzQyqxEbTVG0dfmWFzTxmZNHLvB?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1UkJQ6mJmcSb_MTbzT_8liJZTUMCOLARt?usp=drive_link"
              },
            },
            {
              id: "intro-computer-systems-is",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Fundamentals of computer architecture and system organization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yQK4QiXQ7e7Ui6DLMAGYQa3aTuQp0v9O?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1q0iRgXguAaa2zZTSA9J1smnCwN2PwCAn?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLskaQRgiRMYb0SqvJ-wKx2n4Q3CB5uQ8e&si=wXANl6gRLW404zuP"],
                summaries: "https://drive.google.com/drive/folders/1RFPXNiitr2yiHr1AyCsZWuTX0rYyOwIL?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1hTVXduWW2Icy8HY-uOc5lEiUUM42RSkB?usp=drive_link",
                quizzes: [
                  {
                    id: "CS_001",
                    name: "Chapter 1 : Introduction to Computer Systems",
                    code: "CS_001",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_001.json"
                  },
                  {
                    id: "CS_002",
                    name: "Chapter 2 : Processing and Memory Management",
                    code: "CS_002",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_002.json"
                  },
                  {
                    id: "CS_003",
                    name: "Chapter 3 : Storage",
                    code: "CS_003",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_003.json"
                  },
                  {
                    id: "CS_004",
                    name: "Chapter 4 : Input and Output",
                    code: "CS_004",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_004.json"
                  },
                  {
                    id: "CS_005",
                    name: "Chapter 5 : System Software",
                    code: "CS_005",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_005.json"
                  },
                  {
                    id: "CS_006",
                    name: "Chapter 6 : Applications Software (1/2)",
                    code: "CS_006",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_006.json"
                  }
                  ,{
                    id: "CS_007",
                    name: "Chapter 6 : Applications Software (2/2)",
                    code: "CS_007",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_007.json"
                  }
                  ,{
                    id: "CS_008",
                    name: "Chapter 7 : Computer Networks",
                    code: "CS_008",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_008.json"
                  },
                  {
                    id: "CS_009",
                    name: "Chapter 13 : Program Dev & Programming Languages",
                    code: "CS_009",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_009.json"
                  },
                  {
                    id: "CS_010",
                    name: "Converting Binary to Decimal and Vice Versa",
                    code: "CS_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_010.json"
                  },
                  {
                    id: "CS_011",
                    name: "Converting Binary to Octal and Vice Versa",
                    code: "CS_011",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_011.json"
                  },
                  {
                    id: "CS_012",
                    name: "Converting Binary to Hexadecimal and Vice Versa",
                    code: "CS_012",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_012.json"
                  },
                  {
                    id: "CS_013",
                    name: "Converting Decimal to Octal and Vice Versa",
                    code: "CS_013",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_013.json"
                  },
                  {
                    id: "CS_014",
                    name: "Converting Decimal to Hexadecimal and Vice Versa",
                    code: "CS_014",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_014.json"
                  },
                  {
                    id: "CS_015",
                    name: "Converting Octal to Hexadecimal and Vice Versa",
                    code: "CS_015",
                    duration: "OP",
                    questions: 10,
                    jsonFile: "/quizzes/Computer System/CS_015.json"
                  },
                  {
                    id: "CS_016",
                    name: "Converting Gray Code to Binary and Vice Versa",
                    code: "CS_016",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_016.json"
                  },
                  {
                    id: "CS_017",
                    name: "Converting BCD to Decimal and Vice Versa",
                    code: "CS_017",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_017.json"
                  }
                ],
              },
            },
            {
              id: "intro-data-sciences-is",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Overview of data science concepts, tools, and methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10SsZONPzWccvjTQB4ZcHmT0j_FU8b981?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14IwWgXRgD8G2IPJ2op1RdBIj9pgs77LJ?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLNVsyemi1cQyXLWT3vm4GbWzVxAK_4nbR&si=Q7kxeMYT4iXhr2uC"],
                summaries: "https://drive.google.com/drive/folders/13IFz-O_64Ga8y9TyFe13CSovw0xzxdUQ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1adpsd15n6hieC29aQECkrftCHNz20U9c?usp=drive_link",
                quizzes: [
                  {
                    id: "DS_001",
                    name: "Lecture 1 - Introduction to Data Science",
                    code: "DS_001",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_001.json"
                  },
                  {
                    id: "DS_002",
                    name: "Lecture 2 - Big Data",
                    code: "DS_002",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_002.json"
                  },
                  {
                    id: "DS_003",
                    name: "Lecture 3 - Data Analytics lifecycle (Characters)",
                    code: "DS_003",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_003.json"
                  },
                  {
                    id: "DS_004",
                    name: "Lecture 4 - Data Analytics lifecycle (Phases)",
                    code: "DS_004",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_004.json"
                  },
                  {
                    id: "DS_005",
                    name: "Lecture 5 - Clustering Analysis",
                    code: "DS_005",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_005.json"
                  },
                  {
                    id: "DS_006",
                    name: "Lecture 6 - Introduction Association Rules (1/2)",
                    code: "DS_006",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_006.json"
                  },
                  {
                    id: "DS_007",
                    name: "Lecture 7 - Introduction Association Rules (2/2)",
                    code: "DS_007",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_007.json"
                  },
                  {
                    id: "DS_008",
                    name: "Lecture 8 - Data Visualization",
                    code: "DS_008",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_008.json"
                  },
                  {
                    id: "DS_009",
                    name: "Lecture 9 - Classification Analysis",
                    code: "DS_009",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_009.json"
                  },
                  {
                    id: "DS_010",
                    name: "Lecture 10 - Decision Trees",
                    code: "DS_010",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_010.json"
                  }
                ],
              },
            },
            {
              id: "programming-1-is",
              name: "Programming I",
              code: "02-24-00105",
              description: "Introduction to programming concepts and problem-solving techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1VDUvvvKoRcBfdCAgdO5GUa8ourGzEj43?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14-W3wcsn8gw2ym8CnIo_L6jh0RfQW-mR?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AajYlZGzU_LVrHdoouf8W6ZN&si=_3EUjHYYQd7xAuGr", "https://youtube.com/playlist?list=PL1DUmTEdeA6K7rdxKiWJq6JIxTvHalY8f&si=wl8ryBAWTyTatxTw"],
                summaries: "https://drive.google.com/drive/folders/19GRYDzueyRIB45_CJGn9Qh3_3JkIgfQH?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1wT8Ad9IGifK4NMgE71xXzLhXs4FF0wuc?usp=drive_link",
                quizzes: [
                  {
                    id: "PR1_30001",
                    name: "Chapter 1 : Introduction to Programming",
                    code: "PR1_30001",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30001.json"
                  },
                  {
                    id: "PR1_30002",
                    name: "Chapter 2-1 : Introduction to Java Programming",
                    code: "PR1_30002",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30002.json"
                  },
                  {
                    id: "PR1_30003",
                    name: "Chapter 2-2 : Java Basics",
                    code: "PR1_30003",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30003.json"
                  },
                  {
                    id: "PR1_30004",
                    name: "Chapter 2-3 : Java Basics",
                    code: "PR1_30004",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30004.json"
                  },
                  {
                    id: "PR1_30005",
                    name: "Chapter 2-4 : Deep Dive into Java",
                    code: "PR1_30005",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30005.json"
                  },
                  {
                    id: "PR1_30006",
                    name: "Chapter 3-1 : Controlling Program Flow",
                    code: "PR1_30006",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30006.json"
                  },
                  {
                    id: "PR1_30007",
                    name: "Chapter 3-2 : Controlling Program Flow",
                    code: "PR1_30007",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30007.json"
                  },
                  {
                    id: "PR1_30008",
                    name: "Chapter 4-1 : One Dimensional Arrays",
                    code: "PR1_30008",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30008.json"
                  },
                  {
                    id: "PR1_30009",
                    name: "Chapter 4-2 : Multi Dimensional Arrays",
                    code: "PR1_30009",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30009.json"
                  },
                  {
                    id: "PR1_30010",
                    name: "Review 1",
                    code: "PR1_30010",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30010.json"
                  },
                  {
                    id: "PR1_30011",
                    name: "Review 2",
                    code: "PR1_30011",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30011.json"
                  },
                  {
                    id: "PR1_30012",
                    name: "Tracing and Debugging",
                    code: "PR1_30012",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30012.json"
                  },
                ],
              
              },
            },
            {
              id: "critical-thinking-is",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Development of analytical and critical thinking skills",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1mGHqF_BIXdX-S6BipXm942CsOvr6WHTG?usp=drive_link",
                sections: '',
                videos: ["https://youtube.com/playlist?list=PL2y4AZEEnQLmigukmMl5lD0CkewT1pBQ3&si=GijvUZQgn4vO1gdR"],
                summaries: "https://drive.google.com/drive/folders/1He5H59nOzExcoG5GYaujPWQVnKTZwD2Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ZfnkRMneHYU5wYlq4738XZt1NvGlRbt6?usp=drive_link"
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-is",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Fundamental concepts of probability theory and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/14WxYDv-3V5hBNF2FTrLEKkZpPQJjwyUb?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yy9aqzmJsEDZasn2VT1nfzIdJoajEf6F?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PL7snZ0LSsq3g9NUio7xFDtC9IVIj649GV","https://youtube.com/playlist?list=PLXCWPoTuIpYbXgbNuQkBHlMwjK6DpnQ3l"],
                summaries: "https://drive.google.com/drive/folders/1CmL8lOIlbHdYCAhNa5cJSbDSTGEJVdMt?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1reVZYtR8aOBqpHY8PSn2vmwVwNCS_nQC?usp=drive_link"
              },
            },
            {
              id: "discrete-structures-is",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures and logic for computer science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/12dEJoHHZhCBjBG1KiV2T92HLsGRtDIn8?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1KnWe1Ciq3ETioGCIApu89Sc3Y1FvEgIO?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLxIvc-MGOs6gZlMVYOOEtUHJmfUquCjwz",
                summaries: "https://drive.google.com/drive/folders/1sqiDSQMkoYZCehzIgdyxZcNRSYpIkLnX?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1SgzQqrBfbam-yqOw8xOdq9SKXPlScR2k?usp=drive_link",
                quizzes: [
                  {
                    id: "DM_001",
                    name: "Intro to Discrete Math",
                    code: "DM_001",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_001.json"
                  },
                  {
                    id: "DM_002",
                    name: "Bit Operations",
                    code: "DM_002",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_002.json"
                  },
                  {
                    id: "DM_003",
                    name: "Predicates and Quantifiers",
                    code: "DM_003",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_003.json"
                  },
                  {
                    id: "DM_004",
                    name: "Sets and Functions",
                    code: "DM_004",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_004.json"
                  },
                  {
                    id: "DM_005",
                    name: "Set Operations",
                    code: "DM_005",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_005.json"
                  },
                  {
                    id: "DM_006",
                    name: "Functions Domain",
                    code: "DM_006",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_006.json"
                  },
                  {
                    id: "DM_007",
                    name: "Product Rule",
                    code: "DM_007",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_007.json"
                  },
                  {
                    id: "DM_008",
                    name: "Password Counting",
                    code: "DM_008",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_008.json"
                  },
                  {
                    id: "DM_009",
                    name: "Permutations Combinations",
                    code: "DM_009",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_009.json"
                  },
                ] 
              },
            },
            {
              id: "data-structures-algorithms-is",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Fundamental data structures and algorithmic problem-solving",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1U2vmhFrPOs46SZk-rNdzE4yrCIPL5Qow?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1nr2Og9PqyiRYGl7jFJOtgZx1LGZfeHvY?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp",
                summaries: "https://drive.google.com/drive/folders/1Oiki77OjApABjz0z7D3j2g-Kxc7-hN59?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1IADSkBhDhvgjpDJecfTf9VlvdoJ9P2hD?usp=drive_link",
                quizzes: [
                  {
                    id: "STR_001",
                    name: "Introduction to Data Structures",
                    code: "STR_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_001.json"
                  },
                  {
                    id: "STR_002",
                    name: "Singly Linked List",
                    code: "STR_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_002.json"
                  },
                  {
                    id: "STR_003",
                    name: "Doubly Linked List",
                    code: "STR_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_003.json"
                  },
                  {
                    id: "STR_004",
                    name: "Hash Table",
                    code: "STR_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_004.json"
                  },
                  {
                    id: "STR_005",
                    name: "Stack - Queue - PQ",
                    code: "STR_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_005.json"
                  },
                  {
                    id: "STR_006",
                    name: "BST (Binary Search Tree)",
                    code: "STR_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_006.json"
                  },
                  {
                    id: "STR_007",
                    name: "Sorting Algorithms",
                    code: "STR_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_007.json"
                  },
                  {
                    id: "STR_008",
                    name: "Heap Tree",
                    code: "STR_008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_008.json"
                  },
                  {
                    id: "STR_009",
                    name: "General Review (Part 1)",
                    code: "STR_009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_009.json"
                  },
                  {
                    id: "STR_010",
                    name: "General Review (Part 2)",
                    code: "STR_010",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_010.json"
                  },
                ]
              },
            },
            {
              id: "intro-artificial-intelligence-is",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Basic concepts and applications of artificial intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1tp-If4eJhcAY4dIzgSieKIj3YVdSF-8m?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYXjZlFJL8FfAKoyhDbshpwwLVBN700R?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1RaS9fI4MaHKg_Bxs_GgyYE_LVuaG3kaJ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1jjGy4TJ8EbON_k0hf2exQNQtQx2KR4wr?usp=drive_link"
              },
            },
            {
              id: "programming-2-is",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming concepts and software development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yiF9hcqLqa-wyKfEzdiWDF0bR4A_VtK2?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1geGGbmFKJYIN1yvyIskEeRyI0Y8zWhpU?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AagY7fFlhCrjpLiIFybW3yQv","https://youtube.com/playlist?list=PL1DUmTEdeA6Icttz-O9C3RPRF8R8Px5vk"],
                summaries: "https://drive.google.com/drive/folders/1VGGZWwQmZdVD8LWI6piI_RzQqdwKq_st?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1dxwniB91RAEtAu0hKLt5cWqb3t1Q0FLI?usp=drive_link",
                quizzes: [
                  {
                    id: "PR2_50001",
                    name: "Functions - Methods (Part 1)",
                    code: "PR2_50001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50001.json"
                  },
                  {
                    id: "PR2_50002",
                    name: "Functions - Methods (Part 2)",
                    code: "PR2_50002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50002.json"
                  },
                  {
                    id: "PR2_50003",
                    name: "Introduction To Object-Oriented Programming",
                    code: "PR2_50003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50003.json"
                  },
                  {
                    id: "PR2_50004",
                    name: "Constructor and It's Types",
                    code: "PR2_50004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50004.json"
                  },
                  {
                    id: "PR2_50005",
                    name: "Inheritance and Polymorphism (Part 1)",
                    code: "PR2_50005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50005.json"
                  },
                  {
                    id: "PR2_50006",
                    name: "Inheritance and Polymorphism (Part 2)",
                    code: "PR2_50006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50006.json"
                  },
                  {
                    id: "PR2_50007",
                    name: "Abstract Class and Interface",
                    code: "PR2_50007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50007.json"
                  },
                  {
                    id: "PR2_50008",
                    name: "Class Relations (Part 1)",
                    code: "PR2_50008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50008.json"
                  },
                  {
                    id: "PR2_50009",
                    name: "Class Relations (Part 2)",
                    code: "PR2_50009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50009.json"
                  },
                  {
                    id: "PR2_50010",
                    name: "Array List in Java",
                    code: "PR2_50010",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50010.json"
                  },
                  {
                    id: "PR2_50011",
                    name: "Exception Handling",
                    code: "PR2_50011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50011.json"
                  },
                  {
                    id: "PR2_50012",
                    name: "Static Keyword and Static Methods",
                    code: "PR2_50012",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50012.json"
                  },
                  {
                    id: "PR2_50013",
                    name: "Recursive Methods and Recursion Concept",
                    code: "PR2_50013",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50013.json"
                  },
                ]
              },
            },
            {
              id: "innovation-entrepreneurship-is",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Principles of innovation and entrepreneurial thinking",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1aEPdYTJoeTy0QhS3j1YE3GnJsjIs_8ij?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1n1AWZVhnH-Hr_8xmF8PiHdzTHYLGIsRa?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1MxzGEcFlQuweR0XHi7zuBMDuIfn00tcZ?usp=drive_link"
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-is",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistical methods and probability distributions",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Cat1L5ibgjDAx3qcU8XpKuM2Sp0jIWdA?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/17m-plzdlLyhkjM_TFmcYw5AZyC61yNrx?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL7snZ0LSsq3g6KzD6pdqwU3_Do8WPY4M8&si=1ZMtkTPNNIX7q31M",
                summaries: "https://drive.google.com/drive/folders/1z2c94GAfxG4TdX63ZY_rZSicvEZlrRHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1QRMaP_UgieJRGo5ebwvD_bIu9EMF0SYs?usp=drive_link"
              },
            },
            {
              id: "intro-databases-is",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database design, implementation, and management principles",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10DIqel1WkLIg5YZ1qbT604vRdpVPyLZ6?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1a78X1gWfKKui7qrsGkHvwycayAssG8Le?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL37D52B7714788190&si=9Qkf5KQWLTXqYKt1",
                summaries: "https://drive.google.com/drive/folders/1vMRqmZ7ID3YIT920N6loq_yJKOQSOG65?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1luaj1L4qB2T3hTcQvwra667abVRXOx9c?usp=drive_link"
              },
            },
            {
              id: "numerical-computations-is",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods and computational techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1YerbhXBHp9cLVhuBlsp337xKVS_01139?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1K4WIBD41wo7MP_GwXpo6yfEg-93c2wVM?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1WbNyHrPMQg8aBKK3pEUvBplv7gxzsxHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/14RRGt31M6KSQAxypsDQ2sMI_DR939Wy5?usp=drive_link"
              },
            },
            {
              id: "smart-systems-computational-intelligence",
              name: "Smart Systems and Computational Intelligence",
              code: "02-24-03201",
              description: "Intelligent systems design and computational intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1I-G13-wTo-QEympSlLygMyERa1fuuAzJ?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1As8BizbMGdT8NgI2iyE79kHj9KyFsP_Y?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1fYFXF7nzhy14DZjvCGBbfqOOIU2wG7Op?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1EB83ykK4iM7EKuX518digunlTHW1f48b?usp=drive_link"
              },
            },
            {
              id: "operations-research",
              name: "Operations Research",
              code: "02-24-03202",
              description: "Optimization techniques and operations research methods",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1UsjMAbX3Hylna15Q4mgMvTN60JDWlCsk?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1GNv82mzZ5heehxXkBmSz9bcwBF6twFiE?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1FSJy5BRx93VYB9S5V13LWaVgsgtfDSfR?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1tovGbCvULpJCG6BXHaeuBXN0-EOjAk_Z?usp=drive_link"
              },
            },
            {
              id: "university-elective-1-is",
              name: "Economy Science",
              code: "HE_005",
              description: "Study of economic principles and their applications",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1_Z4FSE1Dx0oJ9_nxbHoFvn1WP2wN-Iyd?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1LuCRHkTxVc_uKOX7SdVEwcc0WrEL-n2D?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1B_bMKIcqQ4t_PsxDR6-GMUWQOv67AvNK?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1qI0ElMk-nNfGv8hH9h3M51Mz9KvEKhIZ?usp=drive_link",
                quizzes: [
                  {
                    id: "ECO_001",
                    name: "الفصل الاول - مقدمة في علم الاقتصاد",
                    code: "ECO_001",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_001.json"
                  },
                  {
                    id: "ECO_002",
                    name: "الفصل الثاني -المشكلة الاقتصادية والنظم الاقتصادية",
                    code: "ECO_002",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_002.json"
                  },
                  {
                    id: "ECO_003",
                    name: "الفصل الثالث - نظرية طلب المستهلك",
                    code: "ECO_003",
                    duration: "OP",
                    questions: 19,
                    jsonFile: "/quizzes/Economic/ECO_003.json"
                  },
                  {
                    id: "ECO_004",
                    name: "الفصل الرابع - العرض في السوق",
                    code: "ECO_004",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_004.json"
                  },
                  {
                    id: "ECO_005",
                    name: "الفصل الخامس - التوازن في السوق",
                    code: "ECO_005",
                    duration: "OP",
                    questions: 12,
                    jsonFile: "/quizzes/Economic/ECO_005.json"
                  },
                  {
                    id: "ECO_006",
                    name: "الفصل السادس - مرونات العرض والطلب",
                    code: "ECO_006",
                    duration: "OP",
                    questions: 27,
                    jsonFile: "/quizzes/Economic/ECO_006.json"
                  },
                  {
                    id: "ECO_007",
                    name: "الفصل السابع - نظرية المنفعة الحدية",
                    code: "ECO_007",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_007.json"
                  },
                  {
                    id: "ECO_008",
                    name: "الفصل التاسع - نظرية الإنتاج",
                    code: "ECO_008",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_008.json"
                  },
                  {
                    id: "ECO_009",
                    name: "الفصل العاشر - تكاليف الإنتاج",
                    code: "ECO_009",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_009.json"
                  },
                  {
                    id: "ECO_010",
                    name: "الفصل الحادي عشر - اسواق المنافسة الكاملة",
                    code: "ECO_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_010.json"
                  },
                  {
                    id: "ECO_011",
                    name: "الفصل الثاني عشر - اسواق المنافسة غير الكاملة",
                    code: "ECO_011",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_011.json"
                  },
                ],
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-is",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms, services, and distributed computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1P37WAFRKgkokNwr6R5MZNOFEpff5dUIB?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1ny-TP92zjTZrctHIBx_QmsTfl52bSP1Q?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/11QHqhN6G_OmTNZTPdR_OVWzUZ5fEMO8X?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ICXoWQy7-nas1_KaLNCA_fHKXEVvRqw2?usp=drive_link",
                quizzes: [
                  {
                    id: "CLC_10661",
                    name: "Introduction to Cloud Computing",
                    code: "CLC_10661",
                    duration: "OP", // <-- CHANGED THIS LINE
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10661.json"
                  },
                  {
                    id: "CLC_10662",
                    name: "Platform and Infrastructure Services",
                    code: "CLC_10662",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10662.json"
                  },
                  {
                    id: "CLC_10663",
                    name: "Virtualization",
                    code: "CLC_10663",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10663.json"
                  },
                  {
                    id: "CLC_10664",
                    name: "Parallel Programming",
                    code: "CLC_10664",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10664.json"
                  },
                  {
                    id: "CLC_10665",
                    name: "Distributed Storage Systems",
                    code: "CLC_10665",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10665.json"
                  },
                  {
                    id: "CLC_10666",
                    name: "Cloud Security",
                    code: "CLC_10666",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10666.json"
                  },
                  {
                    id: "CLC_10667",
                    name: "Cloud Performance",
                    code: "CLC_10667",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10667.json"
                  },
                  {
                    id: "CLC_10668",
                    name: "General Overview + 20Q of 2025's Midterm",
                    code: "CLC_10668",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10668_TOT.json"
                  }
                ],
              },
            },
            {
              id: "machine-learning-is",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Supervised and unsupervised learning algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1CCeA8VUvw__jCBmZ-5Y1J3ujOyir4HSr?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1hO_vvmFpCD9zw4rlK77HIIeNVWpjgM2K?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1XdboKP5n65WZCznnqiCrE0BZfiarSl4Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1WI08MEt_kVSuMITdlqqgPaVpTUPwiqgK?usp=drive_link"
              },
            },
            {
              id: "data-mining-analytics-is",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Techniques for extracting knowledge from large datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Ex-VAzuroLcg0fmSmg-Zd-x6KXCY7P1H?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yRLzmfdAksXPomOZCRLQLG48sWnkQIDc?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1HRedV6Iu8Djd_f0AE0MigL8nKoq8Yb8-?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1mrKwfr3Mgi9p3zp7VdIVLmsUiPYhJYCX?usp=drive_link",
                quizzes:[
                  {
                    id: "MIG_14331",
                    name: "Data Mining Lecture 1",
                    code: "MIG_14331",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14331.json"
                  },
                  {
                    id: "MIG_14332",
                    name: "Data Mining Lecture 2",
                    code: "MIG_14332",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14332.json"
                  },
                  {
                    id: "MIG_14333",
                    name: "Data Mining Lecture 3",
                    code: "MIG_14333",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14333.json"
                  },
                  {
                    id: "MIG_14334",
                    name: "Data Mining Lecture 4",
                    code: "MIG_14334",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14334.json"
                  },
                  {
                    id: "MIG_14335",
                    name: "Data Mining Lecture 5",
                    code: "MIG_14335",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14335.json"
                  },
                  {
                    id: "MIG_14336",
                    name: "Data Mining Lecture 6",
                    code: "MIG_14336",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14336.json"
                  },
                ]
              },
            },
            {
              id: "pattern-recognition",
              name: "Pattern Recognition",
              code: "02-24-03203",
              description: "Pattern recognition algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1vN7tgKg2d-G_CdfvVxA7HU6j2I9Ydfy9?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1J0M6pREMxxh1Q1VfPTjq9YcZCA2QAQ0m?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1I1FfAwEdenpHTKkQCkhBmyK87x0Jrtuo?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1EOh3fcjzdS4xbuedyW6nABttN7iCstLg?usp=drive_link"
              },
            },
            {
              id: "neural-networks",
              name: "Neural Networks",
              code: "02-24-03204",
              description: "Neural network architectures and training methods",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1TuR1Q_kC67HR5Tv-PTRAP26pMvDGfTuN?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1YzLUT2eb03jO0RWT1s1MzUgO43IM_yHp?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1oadfcwGdlId5wEIgOvhlsjTheLes1bGK?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1_qwwnimCKUu5ZiwjeUJMsxk_KElXD3Ce?usp=drive_link"
              },
            },
            // {
            //   id: "university-elective-is-2",
            //   name: "University Elective",
            //   code: "02-0X-000XX",
            //   description: "University-wide elective course",
            //   creditHours: 1,
            //   materials: {
            //     lectures: "https://drive.google.com/drive/folders/university-elective-is-2-lectures",
            //     sections: "https://drive.google.com/drive/folders/university-elective-is-2-sections",
            //     videos: "https://youtube.com/playlist?list=university-elective-is-2-videos",
            //     summaries: "https://drive.google.com/drive/folders/university-elective-is-2-summaries",
            //     exams: "https://drive.google.com/drive/folders/university-elective-is-2-lastexam"
            //   },
            // },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "intelligent-programming",
              name: "Intelligent Programming",
              code: "02-24-03301",
              description: "Programming techniques for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intelligent-programming-lectures",
                sections: "https://drive.google.com/drive/folders/intelligent-programming-sections",
                videos: "https://youtube.com/playlist?list=intelligent-programming-videos",
                exams: "https://drive.google.com/drive/folders/intelligent-programming-lastexam",
                summaries: "https://drive.google.com/drive/folders/intelligent-programming-summaries"
              },
            },
            {
              id: "deep-learning",
              name: "Deep Learning",
              code: "02-24-03302",
              description: "Deep neural networks and advanced architectures",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/deep-learning-lectures",
                sections: "https://drive.google.com/drive/folders/deep-learning-sections",
                videos: "https://youtube.com/playlist?list=deep-learning-videos",
                exams: "https://drive.google.com/drive/folders/deep-learning-lastexam",
                summaries: "https://drive.google.com/drive/folders/deep-learning-summaries"
              },
            },
            {
              id: "modern-control-systems",
              name: "Modern Control Systems",
              code: "02-24-03303",
              description: "Control theory for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/modern-control-systems-lectures",
                sections: "https://drive.google.com/drive/folders/modern-control-systems-sections",
                videos: "https://youtube.com/playlist?list=modern-control-systems-videos",
                exams: "https://drive.google.com/drive/folders/modern-control-systems-lastexam",
                summaries: "https://drive.google.com/drive/folders/modern-control-systems-summaries"
              },
            },
            {
              id: "faculty-elective-is-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-1-videos",
                exams: "https://drive.google.com/drive/folders/faculty-elective-is-1-lastexam",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-is-1-summaries"
              },
            },
            {
              id: "faculty-elective-is-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-2-videos",
                exams: "https://drive.google.com/drive/folders/faculty-elective-is-2-lastexam",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-is-2-summaries"
              },
            },
            {
              id: "university-elective-is-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-3-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-is-3-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-is-3-lastexam"
              },
            },
          ],
          term2: [
            {
              id: "embedded-systems",
              name: "Embedded Systems",
              code: "02-24-03304",
              description: "Embedded systems for intelligent applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/embedded-systems-lectures",
                sections: "https://drive.google.com/drive/folders/embedded-systems-sections",
                videos: "https://youtube.com/playlist?list=embedded-systems-videos",
                exams: "https://drive.google.com/drive/folders/embedded-systems-lastexam",
                summaries: "https://drive.google.com/drive/folders/embedded-systems-summaries"
              },
            },
            {
              id: "computer-vision",
              name: "Computer Vision",
              code: "02-24-03305",
              description: "Computer vision algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-vision-lectures",
                sections: "https://drive.google.com/drive/folders/computer-vision-sections",
                videos: "https://youtube.com/playlist?list=computer-vision-videos",
                exams: "https://drive.google.com/drive/folders/computer-vision-lastexam",
                summaries: "https://drive.google.com/drive/folders/computer-vision-summaries"
              },
            },
            {
              id: "ai-security-issues",
              name: "AI Security Issues",
              code: "02-24-03306",
              description: "Security challenges and solutions in AI systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ai-security-issues-lectures",
                sections: "https://drive.google.com/drive/folders/ai-security-issues-sections",
                videos: "https://youtube.com/playlist?list=ai-security-issues-videos",
                exams: "https://drive.google.com/drive/folders/ai-security-issues-lastexam",
                summaries: "https://drive.google.com/drive/folders/ai-security-issues-summaries"
              },
            },
            {
              id: "faculty-elective-is-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-3-videos",
                exams: "https://drive.google.com/drive/folders/faculty-elective-is-3-lastexam",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-is-3-summaries"
              },
            },
            {
              id: "faculty-elective-is-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-is-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-is-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-is-4-videos",
                exams: "https://drive.google.com/drive/folders/faculty-elective-is-4-lastexam",
                summaries: "https://drive.google.com/drive/folders/faculty-elective-is-4-summaries"
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "ai-platforms",
              name: "AI Platforms",
              code: "02-24-03401",
              description: "AI development platforms and frameworks",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ai-platforms-lectures",
                sections: "https://drive.google.com/drive/folders/ai-platforms-sections",
                videos: "https://youtube.com/playlist?list=ai-platforms-videos",
                exams: "https://drive.google.com/drive/folders/ai-platforms-lastexam",
                summaries: "https://drive.google.com/drive/folders/ai-platforms-summaries"
              },
            },
            {
              id: "internet-of-things-1",
              name: "Internet of Things I",
              code: "02-24-03402",
              description: "IoT fundamentals and intelligent device integration",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/internet-of-things-1-lectures",
                sections: "https://drive.google.com/drive/folders/internet-of-things-1-sections",
                videos: "https://youtube.com/playlist?list=internet-of-things-1-videos",
                summaries: "https://drive.google.com/drive/folders/internet-of-things-1-summaries",
                exams: "https://drive.google.com/drive/folders/internet-of-things-1-lastexam"
              },
            },
            {
              id: "natural-language-processing-is",
              name: "Natural Language Processing",
              code: "02-24-03403",
              description: "NLP techniques for intelligent systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/natural-language-processing-is-lectures",
                sections: "https://drive.google.com/drive/folders/natural-language-processing-is-sections",
                videos: "https://youtube.com/playlist?list=natural-language-processing-is-videos",
                summaries: "https://drive.google.com/drive/folders/natural-language-processing-is-summaries",
                exams: "https://drive.google.com/drive/folders/natural-language-processing-is-lastexam"
              },
            },
            {
              id: "program-elective-is-1",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-1-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-is-1-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-is-1-lastexam"
              },
            },
            {
              id: "program-elective-is-2",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-2-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-is-2-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-is-2-lastexam"
              },
            },
            {
              id: "university-elective-is-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-4-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-is-4-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-is-4-lastexam"
              },
            },
          ],
          term2: [
            {
              id: "reinforcement-learning",
              name: "Reinforcement Learning",
              code: "02-24-03405",
              description: "Reinforcement learning algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/reinforcement-learning-lectures",
                sections: "https://drive.google.com/drive/folders/reinforcement-learning-sections",
                videos: "https://youtube.com/playlist?list=reinforcement-learning-videos",
                summaries: "https://drive.google.com/drive/folders/reinforcement-learning-summaries",
                exams: "https://drive.google.com/drive/folders/reinforcement-learning-lastexam"
              },
            },
            {
              id: "ai-for-robotics",
              name: "AI for Robotics",
              code: "02-24-03406",
              description: "Artificial intelligence applications in robotics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ai-for-robotics-lectures",
                sections: "https://drive.google.com/drive/folders/ai-for-robotics-sections",
                videos: "https://youtube.com/playlist?list=ai-for-robotics-videos",
                summaries: "https://drive.google.com/drive/folders/ai-for-robotics-summaries",
                exams: "https://drive.google.com/drive/folders/ai-for-robotics-lastexam"
              },
            },
            {
              id: "visual-recognition",
              name: "Visual Recognition",
              code: "02-24-03407",
              description: "Advanced visual recognition and image analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/visual-recognition-lectures",
                sections: "https://drive.google.com/drive/folders/visual-recognition-sections",
                videos: "https://youtube.com/playlist?list=visual-recognition-videos",
                summaries: "https://drive.google.com/drive/folders/visual-recognition-summaries",
                exams: "https://drive.google.com/drive/folders/visual-recognition-lastexam"
              },
            },
            {
              id: "program-elective-is-3",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-3-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-is-3-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-is-3-lastexam"
              },
            },
            {
              id: "program-elective-is-4",
              name: "Program Elective",
              code: "02-24-034XX",
              description: "Specialized intelligent systems program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-is-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-is-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-is-4-videos",
                summaries: "https://drive.google.com/drive/folders/program-elective-is-4-summaries",
                exams: "https://drive.google.com/drive/folders/program-elective-is-4-lastexam"
              },
            },
            {
              id: "university-elective-is-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-is-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-is-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-is-5-videos",
                summaries: "https://drive.google.com/drive/folders/university-elective-is-5-summaries",
                exams: "https://drive.google.com/drive/folders/university-elective-is-5-lastexam"
              },
            },
          ],
        },
      },
    },
  },
  "media-analytics": {
    name: "Media Analytics",
    description: "Digital media analysis, content creation, and multimedia data processing",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-ma",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations for media analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/linear-algebra-ma-lectures",
                sections: "https://drive.google.com/drive/folders/linear-algebra-ma-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-ma-videos",
                summaries: "https://drive.google.com/drive/folders/linear-algebra-ma-summaries",
                exams: "https://drive.google.com/drive/folders/linear-algebra-ma-lastexam"
              },
            },
            {
              id: "calculus-ma",
              name: "Calculus",
              code: "02-24-00102",
              description: "Calculus for media and digital content analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-ma-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-ma-sections",
                videos: "https://youtube.com/playlist?list=calculus-ma-videos",
              },
            },
            {
              id: "intro-computer-systems-ma",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Computer systems for media processing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-ma-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-ma-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-ma-videos",
                summaries: "https://drive.google.com/drive/folders/computer-systems-ma-summaries",
                exams: "https://drive.google.com/drive/folders/computer-systems-ma-lastexam",
                quizzes: [
                  {
                    id: "CS_001",
                    name: "Chapter 1 : Introduction to Computer Systems",
                    code: "CS_001",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_001.json"
                  },
                  {
                    id: "CS_002",
                    name: "Chapter 2 : Processing and Memory Management",
                    code: "CS_002",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_002.json"
                  },
                  {
                    id: "CS_003",
                    name: "Chapter 3 : Storage",
                    code: "CS_003",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_003.json"
                  },
                  {
                    id: "CS_004",
                    name: "Chapter 4 : Input and Output",
                    code: "CS_004",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_004.json"
                  },
                  {
                    id: "CS_005",
                    name: "Chapter 5 : System Software",
                    code: "CS_005",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_005.json"
                  },
                  {
                    id: "CS_006",
                    name: "Chapter 6 : Applications Software (1/2)",
                    code: "CS_006",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_006.json"
                  }
                  ,{
                    id: "CS_007",
                    name: "Chapter 6 : Applications Software (2/2)",
                    code: "CS_007",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_007.json"
                  }
                  ,{
                    id: "CS_008",
                    name: "Chapter 7 : Computer Networks",
                    code: "CS_008",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_008.json"
                  },
                  {
                    id: "CS_009",
                    name: "Chapter 13 : Program Dev & Programming Languages",
                    code: "CS_009",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_009.json"
                  },
                  {
                    id: "CS_010",
                    name: "Converting Binary to Decimal and Vice Versa",
                    code: "CS_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_010.json"
                  },
                  {
                    id: "CS_011",
                    name: "Converting Binary to Octal and Vice Versa",
                    code: "CS_011",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_011.json"
                  },
                  {
                    id: "CS_012",
                    name: "Converting Binary to Hexadecimal and Vice Versa",
                    code: "CS_012",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_012.json"
                  },
                  {
                    id: "CS_013",
                    name: "Converting Decimal to Octal and Vice Versa",
                    code: "CS_013",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_013.json"
                  },
                  {
                    id: "CS_014",
                    name: "Converting Decimal to Hexadecimal and Vice Versa",
                    code: "CS_014",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_014.json"
                  },
                  {
                    id: "CS_015",
                    name: "Converting Octal to Hexadecimal and Vice Versa",
                    code: "CS_015",
                    duration: "OP",
                    questions: 10,
                    jsonFile: "/quizzes/Computer System/CS_015.json"
                  },
                  {
                    id: "CS_016",
                    name: "Converting Gray Code to Binary and Vice Versa",
                    code: "CS_016",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_016.json"
                  },
                  {
                    id: "CS_017",
                    name: "Converting BCD to Decimal and Vice Versa",
                    code: "CS_017",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_017.json"
                  }
                ],
              },
            },
            {
              id: "intro-data-sciences-ma",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Data science fundamentals for media analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-ma-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-ma-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-ma-videos",
                quizzes: [
                  {
                    id: "DS_001",
                    name: "Lecture 1 - Introduction to Data Science",
                    code: "DS_001",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_001.json"
                  },
                  {
                    id: "DS_002",
                    name: "Lecture 2 - Big Data",
                    code: "DS_002",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_002.json"
                  },
                  {
                    id: "DS_003",
                    name: "Lecture 3 - Data Analytics lifecycle (Characters)",
                    code: "DS_003",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_003.json"
                  },
                  {
                    id: "DS_004",
                    name: "Lecture 4 - Data Analytics lifecycle (Phases)",
                    code: "DS_004",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_004.json"
                  },
                  {
                    id: "DS_005",
                    name: "Lecture 5 - Clustering Analysis",
                    code: "DS_005",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_005.json"
                  },
                  {
                    id: "DS_006",
                    name: "Lecture 6 - Introduction Association Rules (1/2)",
                    code: "DS_006",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_006.json"
                  },
                  {
                    id: "DS_007",
                    name: "Lecture 7 - Introduction Association Rules (2/2)",
                    code: "DS_007",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_007.json"
                  },
                  {
                    id: "DS_008",
                    name: "Lecture 8 - Data Visualization",
                    code: "DS_008",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_008.json"
                  },
                  {
                    id: "DS_009",
                    name: "Lecture 9 - Classification Analysis",
                    code: "DS_009",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_009.json"
                  },
                  {
                    id: "DS_010",
                    name: "Lecture 10 - Decision Trees",
                    code: "DS_010",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_010.json"
                  }
                ],
              },
            },
            {
              id: "programming-1-ma",
              name: "Programming I",
              code: "02-24-00105",
              description: "Programming fundamentals for media applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-ma-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-ma-sections",
                videos: "https://youtube.com/playlist?list=programming-1-ma-videos",
              },
            },
            {
              id: "critical-thinking-ma",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Critical thinking for media analysis",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-ma-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-ma-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-ma-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-ma",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Fundamental concepts of probability theory and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/14WxYDv-3V5hBNF2FTrLEKkZpPQJjwyUb?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yy9aqzmJsEDZasn2VT1nfzIdJoajEf6F?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PL7snZ0LSsq3g9NUio7xFDtC9IVIj649GV","https://youtube.com/playlist?list=PLXCWPoTuIpYbXgbNuQkBHlMwjK6DpnQ3l"],
                summaries: "https://drive.google.com/drive/folders/1CmL8lOIlbHdYCAhNa5cJSbDSTGEJVdMt?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1reVZYtR8aOBqpHY8PSn2vmwVwNCS_nQC?usp=drive_link"
              },
            },
            {
              id: "discrete-structures-ma",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures and logic for computer science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/12dEJoHHZhCBjBG1KiV2T92HLsGRtDIn8?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1KnWe1Ciq3ETioGCIApu89Sc3Y1FvEgIO?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLxIvc-MGOs6gZlMVYOOEtUHJmfUquCjwz",
                summaries: "https://drive.google.com/drive/folders/1sqiDSQMkoYZCehzIgdyxZcNRSYpIkLnX?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1SgzQqrBfbam-yqOw8xOdq9SKXPlScR2k?usp=drive_link",
                quizzes: [
                  {
                    id: "DM_001",
                    name: "Intro to Discrete Math",
                    code: "DM_001",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_001.json"
                  },
                  {
                    id: "DM_002",
                    name: "Bit Operations",
                    code: "DM_002",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_002.json"
                  },
                  {
                    id: "DM_003",
                    name: "Predicates and Quantifiers",
                    code: "DM_003",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_003.json"
                  },
                  {
                    id: "DM_004",
                    name: "Sets and Functions",
                    code: "DM_004",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_004.json"
                  },
                  {
                    id: "DM_005",
                    name: "Set Operations",
                    code: "DM_005",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_005.json"
                  },
                  {
                    id: "DM_006",
                    name: "Functions Domain",
                    code: "DM_006",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_006.json"
                  },
                  {
                    id: "DM_007",
                    name: "Product Rule",
                    code: "DM_007",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_007.json"
                  },
                  {
                    id: "DM_008",
                    name: "Password Counting",
                    code: "DM_008",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_008.json"
                  },
                  {
                    id: "DM_009",
                    name: "Permutations Combinations",
                    code: "DM_009",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_009.json"
                  },
                ]      
              },
            },
            {
              id: "data-structures-algorithms-ma",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Fundamental data structures and algorithmic problem-solving",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1U2vmhFrPOs46SZk-rNdzE4yrCIPL5Qow?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1nr2Og9PqyiRYGl7jFJOtgZx1LGZfeHvY?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp",
                summaries: "https://drive.google.com/drive/folders/1Oiki77OjApABjz0z7D3j2g-Kxc7-hN59?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1IADSkBhDhvgjpDJecfTf9VlvdoJ9P2hD?usp=drive_link",
                quizzes: [
                  {
                    id: "STR_001",
                    name: "Introduction to Data Structures",
                    code: "STR_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_001.json"
                  },
                  {
                    id: "STR_002",
                    name: "Singly Linked List",
                    code: "STR_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_002.json"
                  },
                  {
                    id: "STR_003",
                    name: "Doubly Linked List",
                    code: "STR_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_003.json"
                  },
                  {
                    id: "STR_004",
                    name: "Hash Table",
                    code: "STR_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_004.json"
                  },
                  {
                    id: "STR_005",
                    name: "Stack - Queue - PQ",
                    code: "STR_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_005.json"
                  },
                  {
                    id: "STR_006",
                    name: "BST (Binary Search Tree)",
                    code: "STR_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_006.json"
                  },
                  {
                    id: "STR_007",
                    name: "Sorting Algorithms",
                    code: "STR_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_007.json"
                  },
                  {
                    id: "STR_008",
                    name: "Heap Tree",
                    code: "STR_008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_008.json"
                  },
                  {
                    id: "STR_009",
                    name: "General Review (Part 1)",
                    code: "STR_009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_009.json"
                  },
                  {
                    id: "STR_010",
                    name: "General Review (Part 2)",
                    code: "STR_010",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_010.json"
                  },
                ]
              },
            },
            {
              id: "intro-artificial-intelligence-ma",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Basic concepts and applications of artificial intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1tp-If4eJhcAY4dIzgSieKIj3YVdSF-8m?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYXjZlFJL8FfAKoyhDbshpwwLVBN700R?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1RaS9fI4MaHKg_Bxs_GgyYE_LVuaG3kaJ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1jjGy4TJ8EbON_k0hf2exQNQtQx2KR4wr?usp=drive_link"
              },
            },
            {
              id: "programming-2-ma",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming concepts and software development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yiF9hcqLqa-wyKfEzdiWDF0bR4A_VtK2?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1geGGbmFKJYIN1yvyIskEeRyI0Y8zWhpU?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AagY7fFlhCrjpLiIFybW3yQv","https://youtube.com/playlist?list=PL1DUmTEdeA6Icttz-O9C3RPRF8R8Px5vk"],
                summaries: "https://drive.google.com/drive/folders/1VGGZWwQmZdVD8LWI6piI_RzQqdwKq_st?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1dxwniB91RAEtAu0hKLt5cWqb3t1Q0FLI?usp=drive_link",
                quizzes: [
                  {
                    id: "PR2_50001",
                    name: "Functions - Methods (Part 1)",
                    code: "PR2_50001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50001.json"
                  },
                  {
                    id: "PR2_50002",
                    name: "Functions - Methods (Part 2)",
                    code: "PR2_50002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50002.json"
                  },
                  {
                    id: "PR2_50003",
                    name: "Introduction To Object-Oriented Programming",
                    code: "PR2_50003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50003.json"
                  },
                  {
                    id: "PR2_50004",
                    name: "Constructor and It's Types",
                    code: "PR2_50004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50004.json"
                  },
                  {
                    id: "PR2_50005",
                    name: "Inheritance and Polymorphism (Part 1)",
                    code: "PR2_50005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50005.json"
                  },
                  {
                    id: "PR2_50006",
                    name: "Inheritance and Polymorphism (Part 2)",
                    code: "PR2_50006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50006.json"
                  },
                  {
                    id: "PR2_50007",
                    name: "Abstract Class and Interface",
                    code: "PR2_50007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50007.json"
                  },
                  {
                    id: "PR2_50008",
                    name: "Class Relations (Part 1)",
                    code: "PR2_50008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50008.json"
                  },
                  {
                    id: "PR2_50009",
                    name: "Class Relations (Part 2)",
                    code: "PR2_50009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50009.json"
                  },
                  {
                    id: "PR2_50010",
                    name: "Array List in Java",
                    code: "PR2_50010",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50010.json"
                  },
                  {
                    id: "PR2_50011",
                    name: "Exception Handling",
                    code: "PR2_50011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50011.json"
                  },
                  {
                    id: "PR2_50012",
                    name: "Static Keyword and Static Methods",
                    code: "PR2_50012",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50012.json"
                  },
                  {
                    id: "PR2_50013",
                    name: "Recursive Methods and Recursion Concept",
                    code: "PR2_50013",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50013.json"
                  },
                ]
              },
            },
            {
              id: "innovation-entrepreneurship-ma",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Principles of innovation and entrepreneurial thinking",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1aEPdYTJoeTy0QhS3j1YE3GnJsjIs_8ij?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1n1AWZVhnH-Hr_8xmF8PiHdzTHYLGIsRa?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1MxzGEcFlQuweR0XHi7zuBMDuIfn00tcZ?usp=drive_link"
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-ma",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistical methods and probability distributions",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Cat1L5ibgjDAx3qcU8XpKuM2Sp0jIWdA?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/17m-plzdlLyhkjM_TFmcYw5AZyC61yNrx?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL7snZ0LSsq3g6KzD6pdqwU3_Do8WPY4M8&si=1ZMtkTPNNIX7q31M",
                summaries: "https://drive.google.com/drive/folders/1z2c94GAfxG4TdX63ZY_rZSicvEZlrRHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1QRMaP_UgieJRGo5ebwvD_bIu9EMF0SYs?usp=drive_link"
              },
            },
            {
              id: "intro-databases-ma",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database design, implementation, and management principles",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10DIqel1WkLIg5YZ1qbT604vRdpVPyLZ6?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1a78X1gWfKKui7qrsGkHvwycayAssG8Le?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL37D52B7714788190&si=9Qkf5KQWLTXqYKt1",
                summaries: "https://drive.google.com/drive/folders/1vMRqmZ7ID3YIT920N6loq_yJKOQSOG65?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1luaj1L4qB2T3hTcQvwra667abVRXOx9c?usp=drive_link"
              },
            },
            {
              id: "numerical-computations-ma",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods and computational techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1YerbhXBHp9cLVhuBlsp337xKVS_01139?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1K4WIBD41wo7MP_GwXpo6yfEg-93c2wVM?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1WbNyHrPMQg8aBKK3pEUvBplv7gxzsxHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/14RRGt31M6KSQAxypsDQ2sMI_DR939Wy5?usp=drive_link"
              },
            },
            {
              id: "data-driven-journalism",
              name: "Data Driven Journalism",
              code: "02-24-04201",
              description: "Data analysis and visualization for journalism",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/17DyOBlP5AtyL9gfAWs69CGonO1tRD6Y9?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/19yJcRK13uE_EhtZ87kCdxWrXYg1NVZ9y?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1xaILR53ySZKUY_WLI9ifRoLIBcrnPRkY?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1zNkDQpkRlN0P6M8dXVLXd34BR6piY84O?usp=drive_link"
              },
            },
            {
              id: "digital-mass-communication",
              name: "Digital Mass Communication",
              code: "02-24-04202",
              description: "Digital communication theories and practices",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Bah21GU7oDHCcmk5D5KEkSAjcDYMpw_0?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1c1vBKiBvFutaUARuKG38XCBdePWq_ryZ?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1GJlTRf0RR_QsbqNUZzIzBNpZDdWa7_dB?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1l-eSxZso5-W62CCgJHhxe2OWChOGgKeF?usp=drive_link"
              },
            },
            {
              id: "university-elective-1-ma",
              name: "Economy Science",
              code: "HE_005",
              description: "Study of economic principles and their applications",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1_Z4FSE1Dx0oJ9_nxbHoFvn1WP2wN-Iyd?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1LuCRHkTxVc_uKOX7SdVEwcc0WrEL-n2D?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1B_bMKIcqQ4t_PsxDR6-GMUWQOv67AvNK?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1qI0ElMk-nNfGv8hH9h3M51Mz9KvEKhIZ?usp=drive_link",
                quizzes: [
                  {
                    id: "ECO_001",
                    name: "الفصل الاول - مقدمة في علم الاقتصاد",
                    code: "ECO_001",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_001.json"
                  },
                  {
                    id: "ECO_002",
                    name: "الفصل الثاني -المشكلة الاقتصادية والنظم الاقتصادية",
                    code: "ECO_002",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_002.json"
                  },
                  {
                    id: "ECO_003",
                    name: "الفصل الثالث - نظرية طلب المستهلك",
                    code: "ECO_003",
                    duration: "OP",
                    questions: 19,
                    jsonFile: "/quizzes/Economic/ECO_003.json"
                  },
                  {
                    id: "ECO_004",
                    name: "الفصل الرابع - العرض في السوق",
                    code: "ECO_004",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_004.json"
                  },
                  {
                    id: "ECO_005",
                    name: "الفصل الخامس - التوازن في السوق",
                    code: "ECO_005",
                    duration: "OP",
                    questions: 12,
                    jsonFile: "/quizzes/Economic/ECO_005.json"
                  },
                  {
                    id: "ECO_006",
                    name: "الفصل السادس - مرونات العرض والطلب",
                    code: "ECO_006",
                    duration: "OP",
                    questions: 27,
                    jsonFile: "/quizzes/Economic/ECO_006.json"
                  },
                  {
                    id: "ECO_007",
                    name: "الفصل السابع - نظرية المنفعة الحدية",
                    code: "ECO_007",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_007.json"
                  },
                  {
                    id: "ECO_008",
                    name: "الفصل التاسع - نظرية الإنتاج",
                    code: "ECO_008",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_008.json"
                  },
                  {
                    id: "ECO_009",
                    name: "الفصل العاشر - تكاليف الإنتاج",
                    code: "ECO_009",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_009.json"
                  },
                  {
                    id: "ECO_010",
                    name: "الفصل الحادي عشر - اسواق المنافسة الكاملة",
                    code: "ECO_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_010.json"
                  },
                  {
                    id: "ECO_011",
                    name: "الفصل الثاني عشر - اسواق المنافسة غير الكاملة",
                    code: "ECO_011",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_011.json"
                  },
                ],
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-ma",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms, services, and distributed computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1P37WAFRKgkokNwr6R5MZNOFEpff5dUIB?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1ny-TP92zjTZrctHIBx_QmsTfl52bSP1Q?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/11QHqhN6G_OmTNZTPdR_OVWzUZ5fEMO8X?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ICXoWQy7-nas1_KaLNCA_fHKXEVvRqw2?usp=drive_link",
                quizzes: [
                  {
                    id: "CLC_10661",
                    name: "Introduction to Cloud Computing",
                    code: "CLC_10661",
                    duration: "OP", // <-- CHANGED THIS LINE
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10661.json"
                  },
                  {
                    id: "CLC_10662",
                    name: "Platform and Infrastructure Services",
                    code: "CLC_10662",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10662.json"
                  },
                  {
                    id: "CLC_10663",
                    name: "Virtualization",
                    code: "CLC_10663",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10663.json"
                  },
                  {
                    id: "CLC_10664",
                    name: "Parallel Programming",
                    code: "CLC_10664",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10664.json"
                  },
                  {
                    id: "CLC_10665",
                    name: "Distributed Storage Systems",
                    code: "CLC_10665",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10665.json"
                  },
                  {
                    id: "CLC_10666",
                    name: "Cloud Security",
                    code: "CLC_10666",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10666.json"
                  },
                  {
                    id: "CLC_10667",
                    name: "Cloud Performance",
                    code: "CLC_10667",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10667.json"
                  },
                  {
                    id: "CLC_10668",
                    name: "General Overview + 20Q of 2025's Midterm",
                    code: "CLC_10668",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10668_TOT.json"
                  }
                ],
              },
            },
            {
              id: "machine-learning-ma",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Supervised and unsupervised learning algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1CCeA8VUvw__jCBmZ-5Y1J3ujOyir4HSr?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1hO_vvmFpCD9zw4rlK77HIIeNVWpjgM2K?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1XdboKP5n65WZCznnqiCrE0BZfiarSl4Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1WI08MEt_kVSuMITdlqqgPaVpTUPwiqgK?usp=drive_link"
              },
            },
            {
              id: "data-mining-analytics-ma",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Techniques for extracting knowledge from large datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Ex-VAzuroLcg0fmSmg-Zd-x6KXCY7P1H?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yRLzmfdAksXPomOZCRLQLG48sWnkQIDc?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1HRedV6Iu8Djd_f0AE0MigL8nKoq8Yb8-?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1mrKwfr3Mgi9p3zp7VdIVLmsUiPYhJYCX?usp=drive_link",
                quizzes:[
                  {
                    id: "MIG_14331",
                    name: "Data Mining Lecture 1",
                    code: "MIG_14331",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14331.json"
                  },
                  {
                    id: "MIG_14332",
                    name: "Data Mining Lecture 2",
                    code: "MIG_14332",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14332.json"
                  },
                  {
                    id: "MIG_14333",
                    name: "Data Mining Lecture 3",
                    code: "MIG_14333",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14333.json"
                  },
                  {
                    id: "MIG_14334",
                    name: "Data Mining Lecture 4",
                    code: "MIG_14334",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14334.json"
                  },
                  {
                    id: "MIG_14335",
                    name: "Data Mining Lecture 5",
                    code: "MIG_14335",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14335.json"
                  },
                  {
                    id: "MIG_14336",
                    name: "Data Mining Lecture 6",
                    code: "MIG_14336",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14336.json"
                  },
                ]
              },
            },
            {
              id: "digital-video-production",
              name: "Digital Video Production",
              code: "02-24-04203",
              description: "Digital video creation and production techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/digital-video-production-lectures",
                sections: "https://drive.google.com/drive/folders/digital-video-production-sections",
                videos: "https://youtube.com/playlist?list=digital-video-production-videos",
              },
            },
            {
              id: "news-editing-blogging",
              name: "News Editing and Blogging",
              code: "02-24-04204",
              description: "Digital content editing and blog management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/news-editing-blogging-lectures",
                sections: "https://drive.google.com/drive/folders/news-editing-blogging-sections",
                videos: "https://youtube.com/playlist?list=news-editing-blogging-videos",
              },
            },
            {
              id: "university-elective-ma-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "image-processing",
              name: "Image Processing",
              code: "02-24-04301",
              description: "Digital image processing and enhancement techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/image-processing-lectures",
                sections: "https://drive.google.com/drive/folders/image-processing-sections",
                videos: "https://youtube.com/playlist?list=image-processing-videos",
              },
            },
            {
              id: "web-design-seo",
              name: "Web Design and Search-Engine Optimization",
              code: "02-24-04302",
              description: "Web design principles and SEO strategies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/web-design-seo-lectures",
                sections: "https://drive.google.com/drive/folders/web-design-seo-sections",
                videos: "https://youtube.com/playlist?list=web-design-seo-videos",
              },
            },
            {
              id: "computer-audio",
              name: "Computer Audio",
              code: "02-24-04303",
              description: "Digital audio processing and synthesis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-audio-lectures",
                sections: "https://drive.google.com/drive/folders/computer-audio-sections",
                videos: "https://youtube.com/playlist?list=computer-audio-videos",
              },
            },
            {
              id: "faculty-elective-ma-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-1-videos",
              },
            },
            {
              id: "faculty-elective-ma-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-2-videos",
              },
            },
            {
              id: "university-elective-ma-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "infographics-data-visualization",
              name: "Infographics and Data Visualization",
              code: "02-24-04304",
              description: "Creating effective infographics and data visualizations",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/infographics-data-visualization-lectures",
                sections: "https://drive.google.com/drive/folders/infographics-data-visualization-sections",
                videos: "https://youtube.com/playlist?list=infographics-data-visualization-videos",
              },
            },
            {
              id: "natural-language-processing-ma",
              name: "Natural Language Processing",
              code: "02-24-04305",
              description: "NLP for media content analysis and generation",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/natural-language-processing-ma-lectures",
                sections: "https://drive.google.com/drive/folders/natural-language-processing-ma-sections",
                videos: "https://youtube.com/playlist?list=natural-language-processing-ma-videos",
              },
            },
            {
              id: "media-processing",
              name: "Media Processing",
              code: "02-24-04306",
              description: "Advanced multimedia processing techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/media-processing-lectures",
                sections: "https://drive.google.com/drive/folders/media-processing-sections",
                videos: "https://youtube.com/playlist?list=media-processing-videos",
              },
            },
            {
              id: "faculty-elective-ma-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-3-videos",
              },
            },
            {
              id: "faculty-elective-ma-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-ma-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-ma-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-ma-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "computer-graphics",
              name: "Computer Graphics",
              code: "02-24-04401",
              description: "3D graphics programming and rendering techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-graphics-lectures",
                sections: "https://drive.google.com/drive/folders/computer-graphics-sections",
                videos: "https://youtube.com/playlist?list=computer-graphics-videos",
              },
            },
            {
              id: "digital-broadcasting",
              name: "Digital Broadcasting",
              code: "02-24-04402",
              description: "Digital broadcasting technologies and systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/digital-broadcasting-lectures",
                sections: "https://drive.google.com/drive/folders/digital-broadcasting-sections",
                videos: "https://youtube.com/playlist?list=digital-broadcasting-videos",
              },
            },
            {
              id: "audience-research-analysis",
              name: "Audience Research and Analysis",
              code: "02-24-04403",
              description: "Media audience research and behavioral analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/audience-research-analysis-lectures",
                sections: "https://drive.google.com/drive/folders/audience-research-analysis-sections",
                videos: "https://youtube.com/playlist?list=audience-research-analysis-videos",
              },
            },
            {
              id: "program-elective-ma-1",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-1-videos",
              },
            },
            {
              id: "program-elective-ma-2",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-2-videos",
              },
            },
            {
              id: "university-elective-ma-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "social-media-analytics",
              name: "Social Media Analytics",
              code: "02-24-04405",
              description: "Analysis of social media data and engagement metrics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/social-media-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/social-media-analytics-sections",
                videos: "https://youtube.com/playlist?list=social-media-analytics-videos",
              },
            },
            {
              id: "multimedia-analytics",
              name: "Multimedia Analytics",
              code: "02-24-04406",
              description: "Advanced analytics for multimedia content",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/multimedia-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/multimedia-analytics-sections",
                videos: "https://youtube.com/playlist?list=multimedia-analytics-videos",
              },
            },
            {
              id: "public-opinion-e-surveys",
              name: "Public Opinion and E Surveys",
              code: "02-24-04407",
              description: "Digital survey methods and public opinion analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/public-opinion-e-surveys-lectures",
                sections: "https://drive.google.com/drive/folders/public-opinion-e-surveys-sections",
                videos: "https://youtube.com/playlist?list=public-opinion-e-surveys-videos",
              },
            },
            {
              id: "program-elective-ma-3",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-3-videos",
              },
            },
            {
              id: "program-elective-ma-4",
              name: "Program Elective",
              code: "02-24-044XX",
              description: "Specialized media analytics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-ma-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-ma-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-ma-4-videos",
              },
            },
            {
              id: "university-elective-ma-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-ma-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-ma-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-ma-5-videos",
              },
            },
          ],
        },
      },
    },
  },
  "healthcare-informatics": {
    name: "Healthcare Informatics",
    description: "Healthcare data analysis, medical informatics, and health information systems",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-hi",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations for healthcare data analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/linear-algebra-hi-lectures",
                sections: "https://drive.google.com/drive/folders/linear-algebra-hi-sections",
                videos: "https://youtube.com/playlist?list=linear-algebra-hi-videos",
              },
            },
            {
              id: "calculus-hi",
              name: "Calculus",
              code: "02-24-00102",
              description: "Calculus applications in healthcare analytics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/calculus-hi-lectures",
                sections: "https://drive.google.com/drive/folders/calculus-hi-sections",
                videos: "https://youtube.com/playlist?list=calculus-hi-videos",
              },
            },
            {
              id: "intro-computer-systems-hi",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Computer systems for healthcare applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-systems-hi-lectures",
                sections: "https://drive.google.com/drive/folders/computer-systems-hi-sections",
                videos: "https://youtube.com/playlist?list=computer-systems-hi-videos",
                summaries: "https://drive.google.com/drive/folders/computer-systems-hi-summaries",
                exams: "https://drive.google.com/drive/folders/computer-systems-hi-exams",
                quizzes: [
                  {
                    id: "CS_001",
                    name: "Chapter 1 : Introduction to Computer Systems",
                    code: "CS_001",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_001.json"
                  },
                  {
                    id: "CS_002",
                    name: "Chapter 2 : Processing and Memory Management",
                    code: "CS_002",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_002.json"
                  },
                  {
                    id: "CS_003",
                    name: "Chapter 3 : Storage",
                    code: "CS_003",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_003.json"
                  },
                  {
                    id: "CS_004",
                    name: "Chapter 4 : Input and Output",
                    code: "CS_004",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_004.json"
                  },
                  {
                    id: "CS_005",
                    name: "Chapter 5 : System Software",
                    code: "CS_005",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_005.json"
                  },
                  {
                    id: "CS_006",
                    name: "Chapter 6 : Applications Software (1/2)",
                    code: "CS_006",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_006.json"
                  }
                  ,{
                    id: "CS_007",
                    name: "Chapter 6 : Applications Software (2/2)",
                    code: "CS_007",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_007.json"
                  }
                  ,{
                    id: "CS_008",
                    name: "Chapter 7 : Computer Networks",
                    code: "CS_008",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_008.json"
                  },
                  {
                    id: "CS_009",
                    name: "Chapter 13 : Program Dev & Programming Languages",
                    code: "CS_009",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_009.json"
                  },
                  {
                    id: "CS_010",
                    name: "Converting Binary to Decimal and Vice Versa",
                    code: "CS_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_010.json"
                  },
                  {
                    id: "CS_011",
                    name: "Converting Binary to Octal and Vice Versa",
                    code: "CS_011",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_011.json"
                  },
                  {
                    id: "CS_012",
                    name: "Converting Binary to Hexadecimal and Vice Versa",
                    code: "CS_012",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_012.json"
                  },
                  {
                    id: "CS_013",
                    name: "Converting Decimal to Octal and Vice Versa",
                    code: "CS_013",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_013.json"
                  },
                  {
                    id: "CS_014",
                    name: "Converting Decimal to Hexadecimal and Vice Versa",
                    code: "CS_014",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_014.json"
                  },
                  {
                    id: "CS_015",
                    name: "Converting Octal to Hexadecimal and Vice Versa",
                    code: "CS_015",
                    duration: "OP",
                    questions: 10,
                    jsonFile: "/quizzes/Computer System/CS_015.json"
                  },
                  {
                    id: "CS_016",
                    name: "Converting Gray Code to Binary and Vice Versa",
                    code: "CS_016",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_016.json"
                  },
                  {
                    id: "CS_017",
                    name: "Converting BCD to Decimal and Vice Versa",
                    code: "CS_017",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_017.json"
                  }
                ],
              },
            },
            {
              id: "intro-data-sciences-hi",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Data science fundamentals for healthcare",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-sciences-hi-lectures",
                sections: "https://drive.google.com/drive/folders/data-sciences-hi-sections",
                videos: "https://youtube.com/playlist?list=data-sciences-hi-videos",
                quizzes: [
                  {
                    id: "DS_001",
                    name: "Lecture 1 - Introduction to Data Science",
                    code: "DS_001",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_001.json"
                  },
                  {
                    id: "DS_002",
                    name: "Lecture 2 - Big Data",
                    code: "DS_002",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_002.json"
                  },
                  {
                    id: "DS_003",
                    name: "Lecture 3 - Data Analytics lifecycle (Characters)",
                    code: "DS_003",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_003.json"
                  },
                  {
                    id: "DS_004",
                    name: "Lecture 4 - Data Analytics lifecycle (Phases)",
                    code: "DS_004",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_004.json"
                  },
                  {
                    id: "DS_005",
                    name: "Lecture 5 - Clustering Analysis",
                    code: "DS_005",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_005.json"
                  },
                  {
                    id: "DS_006",
                    name: "Lecture 6 - Introduction Association Rules (1/2)",
                    code: "DS_006",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_006.json"
                  },
                  {
                    id: "DS_007",
                    name: "Lecture 7 - Introduction Association Rules (2/2)",
                    code: "DS_007",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_007.json"
                  },
                  {
                    id: "DS_008",
                    name: "Lecture 8 - Data Visualization",
                    code: "DS_008",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_008.json"
                  },
                  {
                    id: "DS_009",
                    name: "Lecture 9 - Classification Analysis",
                    code: "DS_009",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_009.json"
                  },
                  {
                    id: "DS_010",
                    name: "Lecture 10 - Decision Trees",
                    code: "DS_010",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_010.json"
                  }
                ],
              },
            },
            {
              id: "programming-1-hi",
              name: "Programming I",
              code: "02-24-00105",
              description: "Programming fundamentals for healthcare informatics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/programming-1-hi-lectures",
                sections: "https://drive.google.com/drive/folders/programming-1-hi-sections",
                videos: "https://youtube.com/playlist?list=programming-1-hi-videos",
              },
            },
            {
              id: "critical-thinking-hi",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Critical thinking in healthcare decision making",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/critical-thinking-hi-lectures",
                sections: "https://drive.google.com/drive/folders/critical-thinking-hi-sections",
                videos: "https://youtube.com/playlist?list=critical-thinking-hi-videos",
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-hi",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Fundamental concepts of probability theory and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/14WxYDv-3V5hBNF2FTrLEKkZpPQJjwyUb?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yy9aqzmJsEDZasn2VT1nfzIdJoajEf6F?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PL7snZ0LSsq3g9NUio7xFDtC9IVIj649GV","https://youtube.com/playlist?list=PLXCWPoTuIpYbXgbNuQkBHlMwjK6DpnQ3l"],
                summaries: "https://drive.google.com/drive/folders/1CmL8lOIlbHdYCAhNa5cJSbDSTGEJVdMt?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1reVZYtR8aOBqpHY8PSn2vmwVwNCS_nQC?usp=drive_link"
              },
            },
            {
              id: "discrete-structures-hi",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures and logic for computer science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/12dEJoHHZhCBjBG1KiV2T92HLsGRtDIn8?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1KnWe1Ciq3ETioGCIApu89Sc3Y1FvEgIO?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLxIvc-MGOs6gZlMVYOOEtUHJmfUquCjwz",
                summaries: "https://drive.google.com/drive/folders/1sqiDSQMkoYZCehzIgdyxZcNRSYpIkLnX?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1SgzQqrBfbam-yqOw8xOdq9SKXPlScR2k?usp=drive_link",
                quizzes: [
                  {
                    id: "DM_001",
                    name: "Intro to Discrete Math",
                    code: "DM_001",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_001.json"
                  },
                  {
                    id: "DM_002",
                    name: "Bit Operations",
                    code: "DM_002",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_002.json"
                  },
                  {
                    id: "DM_003",
                    name: "Predicates and Quantifiers",
                    code: "DM_003",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_003.json"
                  },
                  {
                    id: "DM_004",
                    name: "Sets and Functions",
                    code: "DM_004",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_004.json"
                  },
                  {
                    id: "DM_005",
                    name: "Set Operations",
                    code: "DM_005",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_005.json"
                  },
                  {
                    id: "DM_006",
                    name: "Functions Domain",
                    code: "DM_006",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_006.json"
                  },
                  {
                    id: "DM_007",
                    name: "Product Rule",
                    code: "DM_007",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_007.json"
                  },
                  {
                    id: "DM_008",
                    name: "Password Counting",
                    code: "DM_008",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_008.json"
                  },
                  {
                    id: "DM_009",
                    name: "Permutations Combinations",
                    code: "DM_009",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_009.json"
                  },
                ]
              },
            },
            {
              id: "data-structures-algorithms-hi",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Fundamental data structures and algorithmic problem-solving",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1U2vmhFrPOs46SZk-rNdzE4yrCIPL5Qow?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1nr2Og9PqyiRYGl7jFJOtgZx1LGZfeHvY?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp",
                summaries: "https://drive.google.com/drive/folders/1Oiki77OjApABjz0z7D3j2g-Kxc7-hN59?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1IADSkBhDhvgjpDJecfTf9VlvdoJ9P2hD?usp=drive_link",
                quizzes: [
                  {
                    id: "STR_001",
                    name: "Introduction to Data Structures",
                    code: "STR_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_001.json"
                  },
                  {
                    id: "STR_002",
                    name: "Singly Linked List",
                    code: "STR_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_002.json"
                  },
                  {
                    id: "STR_003",
                    name: "Doubly Linked List",
                    code: "STR_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_003.json"
                  },
                  {
                    id: "STR_004",
                    name: "Hash Table",
                    code: "STR_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_004.json"
                  },
                  {
                    id: "STR_005",
                    name: "Stack - Queue - PQ",
                    code: "STR_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_005.json"
                  },
                  {
                    id: "STR_006",
                    name: "BST (Binary Search Tree)",
                    code: "STR_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_006.json"
                  },
                  {
                    id: "STR_007",
                    name: "Sorting Algorithms",
                    code: "STR_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_007.json"
                  },
                  {
                    id: "STR_008",
                    name: "Heap Tree",
                    code: "STR_008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_008.json"
                  },
                  {
                    id: "STR_009",
                    name: "General Review (Part 1)",
                    code: "STR_009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_009.json"
                  },
                  {
                    id: "STR_010",
                    name: "General Review (Part 2)",
                    code: "STR_010",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_010.json"
                  },
                ]
              },
            },
            {
              id: "intro-artificial-intelligence-hi",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Basic concepts and applications of artificial intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1tp-If4eJhcAY4dIzgSieKIj3YVdSF-8m?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYXjZlFJL8FfAKoyhDbshpwwLVBN700R?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1RaS9fI4MaHKg_Bxs_GgyYE_LVuaG3kaJ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1jjGy4TJ8EbON_k0hf2exQNQtQx2KR4wr?usp=drive_link"
              },
            },
            {
              id: "programming-2-hi",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming concepts and software development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yiF9hcqLqa-wyKfEzdiWDF0bR4A_VtK2?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1geGGbmFKJYIN1yvyIskEeRyI0Y8zWhpU?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AagY7fFlhCrjpLiIFybW3yQv","https://youtube.com/playlist?list=PL1DUmTEdeA6Icttz-O9C3RPRF8R8Px5vk"],
                summaries: "https://drive.google.com/drive/folders/1VGGZWwQmZdVD8LWI6piI_RzQqdwKq_st?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1dxwniB91RAEtAu0hKLt5cWqb3t1Q0FLI?usp=drive_link",
                quizzes: [
                  {
                    id: "PR2_50001",
                    name: "Functions - Methods (Part 1)",
                    code: "PR2_50001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50001.json"
                  },
                  {
                    id: "PR2_50002",
                    name: "Functions - Methods (Part 2)",
                    code: "PR2_50002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50002.json"
                  },
                  {
                    id: "PR2_50003",
                    name: "Introduction To Object-Oriented Programming",
                    code: "PR2_50003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50003.json"
                  },
                  {
                    id: "PR2_50004",
                    name: "Constructor and It's Types",
                    code: "PR2_50004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50004.json"
                  },
                  {
                    id: "PR2_50005",
                    name: "Inheritance and Polymorphism (Part 1)",
                    code: "PR2_50005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50005.json"
                  },
                  {
                    id: "PR2_50006",
                    name: "Inheritance and Polymorphism (Part 2)",
                    code: "PR2_50006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50006.json"
                  },
                  {
                    id: "PR2_50007",
                    name: "Abstract Class and Interface",
                    code: "PR2_50007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50007.json"
                  },
                  {
                    id: "PR2_50008",
                    name: "Class Relations (Part 1)",
                    code: "PR2_50008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50008.json"
                  },
                  {
                    id: "PR2_50009",
                    name: "Class Relations (Part 2)",
                    code: "PR2_50009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50009.json"
                  },
                  {
                    id: "PR2_50010",
                    name: "Array List in Java",
                    code: "PR2_50010",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50010.json"
                  },
                  {
                    id: "PR2_50011",
                    name: "Exception Handling",
                    code: "PR2_50011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50011.json"
                  },
                  {
                    id: "PR2_50012",
                    name: "Static Keyword and Static Methods",
                    code: "PR2_50012",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50012.json"
                  },
                  {
                    id: "PR2_50013",
                    name: "Recursive Methods and Recursion Concept",
                    code: "PR2_50013",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50013.json"
                  },
                ]
              },
            },
            {
              id: "innovation-entrepreneurship-hi",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Principles of innovation and entrepreneurial thinking",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1aEPdYTJoeTy0QhS3j1YE3GnJsjIs_8ij?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1n1AWZVhnH-Hr_8xmF8PiHdzTHYLGIsRa?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1MxzGEcFlQuweR0XHi7zuBMDuIfn00tcZ?usp=drive_link"
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-hi",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistics for healthcare research",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/probability-statistics-2-hi-lectures",
                sections: "https://drive.google.com/drive/folders/probability-statistics-2-hi-sections",
                videos: "https://youtube.com/playlist?list=probability-statistics-2-hi-videos",
              },
            },
            {
              id: "intro-databases-hi",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database systems for healthcare information management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-databases-hi-lectures",
                sections: "https://drive.google.com/drive/folders/intro-databases-hi-sections",
                videos: "https://youtube.com/playlist?list=intro-databases-hi-videos",
              },
            },
            {
              id: "numerical-computations-hi",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods for healthcare modeling",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/numerical-computations-hi-lectures",
                sections: "https://drive.google.com/drive/folders/numerical-computations-hi-sections",
                videos: "https://youtube.com/playlist?list=numerical-computations-hi-videos",
              },
            },
            {
              id: "intro-epidemiology",
              name: "Introduction to Epidemiology",
              code: "02-24-05201",
              description: "Epidemiological principles and disease surveillance",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/intro-epidemiology-lectures",
                sections: "https://drive.google.com/drive/folders/intro-epidemiology-sections",
                videos: "https://youtube.com/playlist?list=intro-epidemiology-videos",
              },
            },
            {
              id: "anatomy-physiology",
              name: "Anatomy and Physiology",
              code: "02-24-05202",
              description: "Human anatomy and physiological systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/anatomy-physiology-lectures",
                sections: "https://drive.google.com/drive/folders/anatomy-physiology-sections",
                videos: "https://youtube.com/playlist?list=anatomy-physiology-videos",
              },
            },
            {
              id: "university-elective-hi-1",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-1-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-1-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-1-videos",
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-hi",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms, services, and distributed computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1P37WAFRKgkokNwr6R5MZNOFEpff5dUIB?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1ny-TP92zjTZrctHIBx_QmsTfl52bSP1Q?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/11QHqhN6G_OmTNZTPdR_OVWzUZ5fEMO8X?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ICXoWQy7-nas1_KaLNCA_fHKXEVvRqw2?usp=drive_link",
                quizzes: [
                  {
                    id: "CLC_10661",
                    name: "Introduction to Cloud Computing",
                    code: "CLC_10661",
                    duration: "OP", // <-- CHANGED THIS LINE
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10661.json"
                  },
                  {
                    id: "CLC_10662",
                    name: "Platform and Infrastructure Services",
                    code: "CLC_10662",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10662.json"
                  },
                  {
                    id: "CLC_10663",
                    name: "Virtualization",
                    code: "CLC_10663",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10663.json"
                  },
                  {
                    id: "CLC_10664",
                    name: "Parallel Programming",
                    code: "CLC_10664",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10664.json"
                  },
                  {
                    id: "CLC_10665",
                    name: "Distributed Storage Systems",
                    code: "CLC_10665",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10665.json"
                  },
                  {
                    id: "CLC_10666",
                    name: "Cloud Security",
                    code: "CLC_10666",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10666.json"
                  },
                  {
                    id: "CLC_10667",
                    name: "Cloud Performance",
                    code: "CLC_10667",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10667.json"
                  },
                  {
                    id: "CLC_10668",
                    name: "General Overview + 20Q of 2025's Midterm",
                    code: "CLC_10668",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10668_TOT.json"
                  }
                ],
              },
            },
            {
              id: "machine-learning-hi",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Supervised and unsupervised learning algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1CCeA8VUvw__jCBmZ-5Y1J3ujOyir4HSr?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1hO_vvmFpCD9zw4rlK77HIIeNVWpjgM2K?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1XdboKP5n65WZCznnqiCrE0BZfiarSl4Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1WI08MEt_kVSuMITdlqqgPaVpTUPwiqgK?usp=drive_link"
              },
            },
            {
              id: "data-mining-analytics-hi",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Techniques for extracting knowledge from large datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Ex-VAzuroLcg0fmSmg-Zd-x6KXCY7P1H?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yRLzmfdAksXPomOZCRLQLG48sWnkQIDc?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1HRedV6Iu8Djd_f0AE0MigL8nKoq8Yb8-?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1mrKwfr3Mgi9p3zp7VdIVLmsUiPYhJYCX?usp=drive_link",
                quizzes:[
                  {
                    id: "MIG_14331",
                    name: "Data Mining Lecture 1",
                    code: "MIG_14331",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14331.json"
                  },
                  {
                    id: "MIG_14332",
                    name: "Data Mining Lecture 2",
                    code: "MIG_14332",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14332.json"
                  },
                  {
                    id: "MIG_14333",
                    name: "Data Mining Lecture 3",
                    code: "MIG_14333",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14333.json"
                  },
                  {
                    id: "MIG_14334",
                    name: "Data Mining Lecture 4",
                    code: "MIG_14334",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14334.json"
                  },
                  {
                    id: "MIG_14335",
                    name: "Data Mining Lecture 5",
                    code: "MIG_14335",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14335.json"
                  },
                  {
                    id: "MIG_14336",
                    name: "Data Mining Lecture 6",
                    code: "MIG_14336",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14336.json"
                  },
                ]
              },
            },
            {
              id: "pharmacology-chemistry-drugs",
              name: "Pharmacology and Chemistry of Drugs",
              code: "02-24-05203",
              description: "Drug mechanisms and pharmaceutical chemistry",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/pharmacology-chemistry-drugs-lectures",
                sections: "https://drive.google.com/drive/folders/pharmacology-chemistry-drugs-sections",
                videos: "https://youtube.com/playlist?list=pharmacology-chemistry-drugs-videos",
              },
            },
            {
              id: "ethics-regulations-healthcare",
              name: "Ethics & Regulations in Healthcare",
              code: "02-24-05204",
              description: "Healthcare ethics and regulatory compliance",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/ethics-regulations-healthcare-lectures",
                sections: "https://drive.google.com/drive/folders/ethics-regulations-healthcare-sections",
                videos: "https://youtube.com/playlist?list=ethics-regulations-healthcare-videos",
              },
            },
            {
              id: "university-elective-hi-2",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 1,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-2-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-2-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-2-videos",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "neuroscience-robotics",
              name: "Neuroscience and Robotics",
              code: "02-24-05301",
              description: "Neuroscience applications in medical robotics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/neuroscience-robotics-lectures",
                sections: "https://drive.google.com/drive/folders/neuroscience-robotics-sections",
                videos: "https://youtube.com/playlist?list=neuroscience-robotics-videos",
              },
            },
            {
              id: "health-information-systems",
              name: "Health Information Systems",
              code: "02-24-05302",
              description: "Design and implementation of health information systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/health-information-systems-lectures",
                sections: "https://drive.google.com/drive/folders/health-information-systems-sections",
                videos: "https://youtube.com/playlist?list=health-information-systems-videos",
              },
            },
            {
              id: "computer-assisted-drug-design",
              name: "Computer-Assisted Drug Design",
              code: "02-24-05303",
              description: "Computational methods for drug discovery and design",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-assisted-drug-design-lectures",
                sections: "https://drive.google.com/drive/folders/computer-assisted-drug-design-sections",
                videos: "https://youtube.com/playlist?list=computer-assisted-drug-design-videos",
              },
            },
            {
              id: "faculty-elective-hi-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-1-videos",
              },
            },
            {
              id: "faculty-elective-hi-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-2-videos",
              },
            },
            {
              id: "university-elective-hi-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "national-international-healthcare-systems",
              name: "National and International Healthcare Systems",
              code: "02-24-05304",
              description: "Comparative analysis of healthcare systems worldwide",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/national-international-healthcare-systems-lectures",
                sections: "https://drive.google.com/drive/folders/national-international-healthcare-systems-sections",
                videos: "https://youtube.com/playlist?list=national-international-healthcare-systems-videos",
              },
            },
            {
              id: "health-policy-economics",
              name: "Health Policy & Economics",
              code: "02-24-05305",
              description: "Healthcare policy analysis and health economics",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/health-policy-economics-lectures",
                sections: "https://drive.google.com/drive/folders/health-policy-economics-sections",
                videos: "https://youtube.com/playlist?list=health-policy-economics-videos",
              },
            },
            {
              id: "healthcare-market-analytics",
              name: "Healthcare Market Analytics",
              code: "02-24-05306",
              description: "Market analysis and analytics in healthcare industry",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/healthcare-market-analytics-lectures",
                sections: "https://drive.google.com/drive/folders/healthcare-market-analytics-sections",
                videos: "https://youtube.com/playlist?list=healthcare-market-analytics-videos",
              },
            },
            {
              id: "faculty-elective-hi-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-3-videos",
              },
            },
            {
              id: "faculty-elective-hi-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-hi-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-hi-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-hi-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "e-health-telehealth-telemedicine",
              name: "E-health, Telehealth and Telemedicine",
              code: "02-24-05401",
              description: "Digital health technologies and remote healthcare delivery",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/e-health-telehealth-telemedicine-lectures",
                sections: "https://drive.google.com/drive/folders/e-health-telehealth-telemedicine-sections",
                videos: "https://youtube.com/playlist?list=e-health-telehealth-telemedicine-videos",
              },
            },
            {
              id: "mathematical-modelling-health",
              name: "Mathematical Modelling for Health",
              code: "02-24-05402",
              description: "Mathematical models for healthcare and epidemiology",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/mathematical-modelling-health-lectures",
                sections: "https://drive.google.com/drive/folders/mathematical-modelling-health-sections",
                videos: "https://youtube.com/playlist?list=mathematical-modelling-health-videos",
              },
            },
            {
              id: "clinical-medical-care-delivery",
              name: "Clinical & Medical Care Delivery",
              code: "02-24-05403",
              description: "Healthcare delivery systems and clinical workflows",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/clinical-medical-care-delivery-lectures",
                sections: "https://drive.google.com/drive/folders/clinical-medical-care-delivery-sections",
                videos: "https://youtube.com/playlist?list=clinical-medical-care-delivery-videos",
              },
            },
            {
              id: "program-elective-hi-1",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-1-videos",
              },
            },
            {
              id: "program-elective-hi-2",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-2-videos",
              },
            },
            {
              id: "university-elective-hi-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "computerized-disease-registries",
              name: "Computerized Disease Registries",
              code: "02-24-05405",
              description: "Design and management of electronic disease registries",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computerized-disease-registries-lectures",
                sections: "https://drive.google.com/drive/folders/computerized-disease-registries-sections",
                videos: "https://youtube.com/playlist?list=computerized-disease-registries-videos",
              },
            },
            {
              id: "clinical-decision-support-systems",
              name: "Clinical Decision Support Systems",
              code: "02-24-05406",
              description: "AI-powered clinical decision support and expert systems",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/clinical-decision-support-systems-lectures",
                sections: "https://drive.google.com/drive/folders/clinical-decision-support-systems-sections",
                videos: "https://youtube.com/playlist?list=clinical-decision-support-systems-videos",
              },
            },
            {
              id: "health-psychology",
              name: "Health Psychology",
              code: "02-24-05407",
              description: "Psychological factors in health and illness",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/health-psychology-lectures",
                sections: "https://drive.google.com/drive/folders/health-psychology-sections",
                videos: "https://youtube.com/playlist?list=health-psychology-videos",
              },
            },
            {
              id: "program-elective-hi-3",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-3-videos",
              },
            },
            {
              id: "program-elective-hi-4",
              name: "Program Elective",
              code: "02-24-054XX",
              description: "Specialized healthcare informatics program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-hi-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-hi-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-hi-4-videos",
              },
            },
            {
              id: "university-elective-hi-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-hi-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-hi-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-hi-5-videos",
              },
            },
          ],
        },
      },
    },
  },
  "cybersecurity": {
    name: "Cybersecurity",
    description: "Information security, cyber defense, and digital forensics",
    levels: {
      1: {
        subjects: {
          term1: [
            {
              id: "linear-algebra-cs",
              name: "Linear Algebra",
              code: "02-24-00101",
              description: "Mathematical foundations of linear algebra for data science applications",
              creditHours: 3,
              prerequisites: [],
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yFYYS37ERUHG6Ft_HnC17Jmgo-Zsrg06?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/191trjdbwAtjG6yz65q-C1Hd3gigqoti7?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLvuToPs04FnD1lFBolGr4ROQaxQ_zyC1c&si=6IWNZY0eY_ymFdAq"] ,
                exams: "https://drive.google.com/drive/folders/1vUbUjWsbexiPgjDbJOuh-N43PVDc9hjc?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/150zP5Dc9vDKzazlm37IRttDG-_b-opK1?usp=drive_link"
              },
            },
            {
              id: "calculus-cs",
              name: "Calculus",
              code: "02-24-00102",
              description: "Differential and integral calculus with applications in computing",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1LsWVrCXpwVsL7YhGL_QFQhyryvpc_Yon?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1U2LbrtWkf-X8DL3c7Yo12kgV8bbZ0Wb6?usp=drive_link",
                videos: '',
                exams: "https://drive.google.com/drive/folders/1Uf7LaRzQyqxEbTVG0dfmWFzTxmZNHLvB?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1UkJQ6mJmcSb_MTbzT_8liJZTUMCOLARt?usp=drive_link"
              },
            },
            {
              id: "intro-computer-systems-cs",
              name: "Introduction to Computer Systems",
              code: "02-24-00103",
              description: "Fundamentals of computer architecture and system organization",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yQK4QiXQ7e7Ui6DLMAGYQa3aTuQp0v9O?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1q0iRgXguAaa2zZTSA9J1smnCwN2PwCAn?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLskaQRgiRMYb0SqvJ-wKx2n4Q3CB5uQ8e&si=wXANl6gRLW404zuP"],
                summaries: "https://drive.google.com/drive/folders/1RFPXNiitr2yiHr1AyCsZWuTX0rYyOwIL?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1hTVXduWW2Icy8HY-uOc5lEiUUM42RSkB?usp=drive_link",
                quizzes: [
                  {
                    id: "CS_001",
                    name: "Chapter 1 : Introduction to Computer Systems",
                    code: "CS_001",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_001.json"
                  },
                  {
                    id: "CS_002",
                    name: "Chapter 2 : Processing and Memory Management",
                    code: "CS_002",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_002.json"
                  },
                  {
                    id: "CS_003",
                    name: "Chapter 3 : Storage",
                    code: "CS_003",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_003.json"
                  },
                  {
                    id: "CS_004",
                    name: "Chapter 4 : Input and Output",
                    code: "CS_004",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_004.json"
                  },
                  {
                    id: "CS_005",
                    name: "Chapter 5 : System Software",
                    code: "CS_005",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_005.json"
                  },
                  {
                    id: "CS_006",
                    name: "Chapter 6 : Applications Software (1/2)",
                    code: "CS_006",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_006.json"
                  }
                  ,{
                    id: "CS_007",
                    name: "Chapter 6 : Applications Software (2/2)",
                    code: "CS_007",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_007.json"
                  }
                  ,{
                    id: "CS_008",
                    name: "Chapter 7 : Computer Networks",
                    code: "CS_008",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_008.json"
                  },
                  {
                    id: "CS_009",
                    name: "Chapter 13 : Program Dev & Programming Languages",
                    code: "CS_009",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/Computer System/CS_009.json"
                  },
                  {
                    id: "CS_010",
                    name: "Converting Binary to Decimal and Vice Versa",
                    code: "CS_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_010.json"
                  },
                  {
                    id: "CS_011",
                    name: "Converting Binary to Octal and Vice Versa",
                    code: "CS_011",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_011.json"
                  },
                  {
                    id: "CS_012",
                    name: "Converting Binary to Hexadecimal and Vice Versa",
                    code: "CS_012",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_012.json"
                  },
                  {
                    id: "CS_013",
                    name: "Converting Decimal to Octal and Vice Versa",
                    code: "CS_013",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_013.json"
                  },
                  {
                    id: "CS_014",
                    name: "Converting Decimal to Hexadecimal and Vice Versa",
                    code: "CS_014",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Computer System/CS_014.json"
                  },
                  {
                    id: "CS_015",
                    name: "Converting Octal to Hexadecimal and Vice Versa",
                    code: "CS_015",
                    duration: "OP",
                    questions: 10,
                    jsonFile: "/quizzes/Computer System/CS_015.json"
                  },
                  {
                    id: "CS_016",
                    name: "Converting Gray Code to Binary and Vice Versa",
                    code: "CS_016",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_016.json"
                  },
                  {
                    id: "CS_017",
                    name: "Converting BCD to Decimal and Vice Versa",
                    code: "CS_017",
                    duration: "OP",
                    questions: 40,
                    jsonFile: "/quizzes/Computer System/CS_017.json"
                  }
                ],
              },
            },
            {
              id: "intro-data-sciences-cs",
              name: "Introduction to Data Sciences",
              code: "02-24-00104",
              description: "Overview of data science concepts, tools, and methodologies",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10SsZONPzWccvjTQB4ZcHmT0j_FU8b981?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14IwWgXRgD8G2IPJ2op1RdBIj9pgs77LJ?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLNVsyemi1cQyXLWT3vm4GbWzVxAK_4nbR&si=Q7kxeMYT4iXhr2uC"],
                summaries: "https://drive.google.com/drive/folders/13IFz-O_64Ga8y9TyFe13CSovw0xzxdUQ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1adpsd15n6hieC29aQECkrftCHNz20U9c?usp=drive_link",
                quizzes: [
                  {
                    id: "DS_001",
                    name: "Lecture 1 - Introduction to Data Science",
                    code: "DS_001",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_001.json"
                  },
                  {
                    id: "DS_002",
                    name: "Lecture 2 - Big Data",
                    code: "DS_002",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_002.json"
                  },
                  {
                    id: "DS_003",
                    name: "Lecture 3 - Data Analytics lifecycle (Characters)",
                    code: "DS_003",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_003.json"
                  },
                  {
                    id: "DS_004",
                    name: "Lecture 4 - Data Analytics lifecycle (Phases)",
                    code: "DS_004",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_004.json"
                  },
                  {
                    id: "DS_005",
                    name: "Lecture 5 - Clustering Analysis",
                    code: "DS_005",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_005.json"
                  },
                  {
                    id: "DS_006",
                    name: "Lecture 6 - Introduction Association Rules (1/2)",
                    code: "DS_006",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_006.json"
                  },
                  {
                    id: "DS_007",
                    name: "Lecture 7 - Introduction Association Rules (2/2)",
                    code: "DS_007",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_007.json"
                  },
                  {
                    id: "DS_008",
                    name: "Lecture 8 - Data Visualization",
                    code: "DS_008",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_008.json"
                  },
                  {
                    id: "DS_009",
                    name: "Lecture 9 - Classification Analysis",
                    code: "DS_009",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_009.json"
                  },
                  {
                    id: "DS_010",
                    name: "Lecture 10 - Decision Trees",
                    code: "DS_010",
                    duration: "OP",
                    questions: 25,
                    jsonFile: "/quizzes/Data Science/DS_Quizzes/DS_010.json"
                  }
                ],
              },
            },
            {
              id: "programming-1-cs",
              name: "Programming I",
              code: "02-24-00105",
              description: "Introduction to programming concepts and problem-solving techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1VDUvvvKoRcBfdCAgdO5GUa8ourGzEj43?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/14-W3wcsn8gw2ym8CnIo_L6jh0RfQW-mR?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AajYlZGzU_LVrHdoouf8W6ZN&si=_3EUjHYYQd7xAuGr", "https://youtube.com/playlist?list=PL1DUmTEdeA6K7rdxKiWJq6JIxTvHalY8f&si=wl8ryBAWTyTatxTw"],
                summaries: "https://drive.google.com/drive/folders/19GRYDzueyRIB45_CJGn9Qh3_3JkIgfQH?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1wT8Ad9IGifK4NMgE71xXzLhXs4FF0wuc?usp=drive_link",
                quizzes: [
                  {
                    id: "PR1_30001",
                    name: "Chapter 1 : Introduction to Programming",
                    code: "PR1_30001",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30001.json"
                  },
                  {
                    id: "PR1_30002",
                    name: "Chapter 2-1 : Introduction to Java Programming",
                    code: "PR1_30002",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30002.json"
                  },
                  {
                    id: "PR1_30003",
                    name: "Chapter 2-2 : Java Basics",
                    code: "PR1_30003",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30003.json"
                  },
                  {
                    id: "PR1_30004",
                    name: "Chapter 2-3 : Java Basics",
                    code: "PR1_30004",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30004.json"
                  },
                  {
                    id: "PR1_30005",
                    name: "Chapter 2-4 : Deep Dive into Java",
                    code: "PR1_30005",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30005.json"
                  },
                  {
                    id: "PR1_30006",
                    name: "Chapter 3-1 : Controlling Program Flow",
                    code: "PR1_30006",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30006.json"
                  },
                  {
                    id: "PR1_30007",
                    name: "Chapter 3-2 : Controlling Program Flow",
                    code: "PR1_30007",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30007.json"
                  },
                  {
                    id: "PR1_30008",
                    name: "Chapter 4-1 : One Dimensional Arrays",
                    code: "PR1_30008",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30008.json"
                  },
                  {
                    id: "PR1_30009",
                    name: "Chapter 4-2 : Multi Dimensional Arrays",
                    code: "PR1_30009",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30009.json"
                  },
                  {
                    id: "PR1_30010",
                    name: "Review 1",
                    code: "PR1_30010",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30010.json"
                  },
                  {
                    id: "PR1_30011",
                    name: "Review 2",
                    code: "PR1_30011",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30011.json"
                  },
                  {
                    id: "PR1_30012",
                    name: "Tracing and Debugging",
                    code: "PR1_30012",
                    duration: "OP", // in minutes
                    questions: 30,
                    jsonFile: "/quizzes/programming/programming1/PR1_30012.json"
                  },
                ],
              
              },
            },
            {
              id: "critical-thinking-sc",
              name: "Critical Thinking",
              code: "02-00-000XX",
              description: "Development of analytical and critical thinking skills",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1mGHqF_BIXdX-S6BipXm942CsOvr6WHTG?usp=drive_link",
                sections: '',
                videos: ["https://youtube.com/playlist?list=PL2y4AZEEnQLmigukmMl5lD0CkewT1pBQ3&si=GijvUZQgn4vO1gdR"],
                summaries: "https://drive.google.com/drive/folders/1He5H59nOzExcoG5GYaujPWQVnKTZwD2Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ZfnkRMneHYU5wYlq4738XZt1NvGlRbt6?usp=drive_link"
              },
            },
          ],
          term2: [
            {
              id: "probability-statistics-1-cs",
              name: "Probability and Statistics I",
              code: "02-24-00106",
              description: "Fundamental concepts of probability theory and statistical analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/14WxYDv-3V5hBNF2FTrLEKkZpPQJjwyUb?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yy9aqzmJsEDZasn2VT1nfzIdJoajEf6F?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PL7snZ0LSsq3g9NUio7xFDtC9IVIj649GV","https://youtube.com/playlist?list=PLXCWPoTuIpYbXgbNuQkBHlMwjK6DpnQ3l"],
                summaries: "https://drive.google.com/drive/folders/1CmL8lOIlbHdYCAhNa5cJSbDSTGEJVdMt?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1reVZYtR8aOBqpHY8PSn2vmwVwNCS_nQC?usp=drive_link"
              },
            },
            {
              id: "discrete-structures-cs",
              name: "Discrete Structures",
              code: "02-24-00107",
              description: "Mathematical structures and logic for computer science",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/12dEJoHHZhCBjBG1KiV2T92HLsGRtDIn8?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1KnWe1Ciq3ETioGCIApu89Sc3Y1FvEgIO?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLxIvc-MGOs6gZlMVYOOEtUHJmfUquCjwz",
                summaries: "https://drive.google.com/drive/folders/1sqiDSQMkoYZCehzIgdyxZcNRSYpIkLnX?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1SgzQqrBfbam-yqOw8xOdq9SKXPlScR2k?usp=drive_link",
                quizzes: [
                  {
                    id: "DM_001",
                    name: "Intro to Discrete Math",
                    code: "DM_001",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_001.json"
                  },
                  {
                    id: "DM_002",
                    name: "Bit Operations",
                    code: "DM_002",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_002.json"
                  },
                  {
                    id: "DM_003",
                    name: "Predicates and Quantifiers",
                    code: "DM_003",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_003.json"
                  },
                  {
                    id: "DM_004",
                    name: "Sets and Functions",
                    code: "DM_004",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_004.json"
                  },
                  {
                    id: "DM_005",
                    name: "Set Operations",
                    code: "DM_005",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_005.json"
                  },
                  {
                    id: "DM_006",
                    name: "Functions Domain",
                    code: "DM_006",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_006.json"
                  },
                  {
                    id: "DM_007",
                    name: "Product Rule",
                    code: "DM_007",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_007.json"
                  },
                  {
                    id: "DM_008",
                    name: "Password Counting",
                    code: "DM_008",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_008.json"
                  },
                  {
                    id: "DM_009",
                    name: "Permutations Combinations",
                    code: "DM_009",
                    duration: "OP", // in minutes
                    questions: 25,
                    jsonFile: "/quizzes/Discrete Math/DM_009.json"
                  },
                ]  
              },
            },
            {
              id: "data-structures-algorithms-cs",
              name: "Data Structures and Algorithms",
              code: "02-24-00108",
              description: "Fundamental data structures and algorithmic problem-solving",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1U2vmhFrPOs46SZk-rNdzE4yrCIPL5Qow?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1nr2Og9PqyiRYGl7jFJOtgZx1LGZfeHvY?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp",
                summaries: "https://drive.google.com/drive/folders/1Oiki77OjApABjz0z7D3j2g-Kxc7-hN59?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1IADSkBhDhvgjpDJecfTf9VlvdoJ9P2hD?usp=drive_link",
                quizzes: [
                  {
                    id: "STR_001",
                    name: "Introduction to Data Structures",
                    code: "STR_001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_001.json"
                  },
                  {
                    id: "STR_002",
                    name: "Singly Linked List",
                    code: "STR_002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_002.json"
                  },
                  {
                    id: "STR_003",
                    name: "Doubly Linked List",
                    code: "STR_003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_003.json"
                  },
                  {
                    id: "STR_004",
                    name: "Hash Table",
                    code: "STR_004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_004.json"
                  },
                  {
                    id: "STR_005",
                    name: "Stack - Queue - PQ",
                    code: "STR_005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_005.json"
                  },
                  {
                    id: "STR_006",
                    name: "BST (Binary Search Tree)",
                    code: "STR_006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_006.json"
                  },
                  {
                    id: "STR_007",
                    name: "Sorting Algorithms",
                    code: "STR_007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_007.json"
                  },
                  {
                    id: "STR_008",
                    name: "Heap Tree",
                    code: "STR_008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_008.json"
                  },
                  {
                    id: "STR_009",
                    name: "General Review (Part 1)",
                    code: "STR_009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_009.json"
                  },
                  {
                    id: "STR_010",
                    name: "General Review (Part 2)",
                    code: "STR_010",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/Data Structures/STR_010.json"
                  },
                ]
              },
            },
            {
              id: "intro-artificial-intelligence-cs",
              name: "Introduction to Artificial Intelligence",
              code: "02-24-00109",
              description: "Basic concepts and applications of artificial intelligence",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1tp-If4eJhcAY4dIzgSieKIj3YVdSF-8m?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYXjZlFJL8FfAKoyhDbshpwwLVBN700R?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1RaS9fI4MaHKg_Bxs_GgyYE_LVuaG3kaJ?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1jjGy4TJ8EbON_k0hf2exQNQtQx2KR4wr?usp=drive_link"
              },
            },
            {
              id: "programming-2-cs",
              name: "Programming II",
              code: "02-24-00110",
              description: "Advanced programming concepts and software development",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1yiF9hcqLqa-wyKfEzdiWDF0bR4A_VtK2?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1geGGbmFKJYIN1yvyIskEeRyI0Y8zWhpU?usp=drive_link",
                videos: ["https://youtube.com/playlist?list=PLCInYL3l2AagY7fFlhCrjpLiIFybW3yQv","https://youtube.com/playlist?list=PL1DUmTEdeA6Icttz-O9C3RPRF8R8Px5vk"],
                summaries: "https://drive.google.com/drive/folders/1VGGZWwQmZdVD8LWI6piI_RzQqdwKq_st?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1dxwniB91RAEtAu0hKLt5cWqb3t1Q0FLI?usp=drive_link",
                quizzes: [
                  {
                    id: "PR2_50001",
                    name: "Functions - Methods (Part 1)",
                    code: "PR2_50001",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50001.json"
                  },
                  {
                    id: "PR2_50002",
                    name: "Functions - Methods (Part 2)",
                    code: "PR2_50002",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50002.json"
                  },
                  {
                    id: "PR2_50003",
                    name: "Introduction To Object-Oriented Programming",
                    code: "PR2_50003",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50003.json"
                  },
                  {
                    id: "PR2_50004",
                    name: "Constructor and It's Types",
                    code: "PR2_50004",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50004.json"
                  },
                  {
                    id: "PR2_50005",
                    name: "Inheritance and Polymorphism (Part 1)",
                    code: "PR2_50005",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50005.json"
                  },
                  {
                    id: "PR2_50006",
                    name: "Inheritance and Polymorphism (Part 2)",
                    code: "PR2_50006",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50006.json"
                  },
                  {
                    id: "PR2_50007",
                    name: "Abstract Class and Interface",
                    code: "PR2_50007",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50007.json"
                  },
                  {
                    id: "PR2_50008",
                    name: "Class Relations (Part 1)",
                    code: "PR2_50008",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50008.json"
                  },
                  {
                    id: "PR2_50009",
                    name: "Class Relations (Part 2)",
                    code: "PR2_50009",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50009.json"
                  },
                  {
                    id: "PR2_50010",
                    name: "Array List in Java",
                    code: "PR2_50010",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50010.json"
                  },
                  {
                    id: "PR2_50011",
                    name: "Exception Handling",
                    code: "PR2_50011",
                    duration: "OP", // in minutes
                    questions: 20,
                    jsonFile: "/quizzes/programming/programming2/PR2_50011.json"
                  },
                  {
                    id: "PR2_50012",
                    name: "Static Keyword and Static Methods",
                    code: "PR2_50012",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50012.json"
                  },
                  {
                    id: "PR2_50013",
                    name: "Recursive Methods and Recursion Concept",
                    code: "PR2_50013",
                    duration: "OP", // in minutes
                    questions: 15,
                    jsonFile: "/quizzes/programming/programming2/PR2_50013.json"
                  },
                ]
              },
            },
            {
              id: "innovation-entrepreneurship-cs",
              name: "Innovation & Entrepreneurship",
              code: "02-00-000XX",
              description: "Principles of innovation and entrepreneurial thinking",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1aEPdYTJoeTy0QhS3j1YE3GnJsjIs_8ij?usp=drive_link",
                sections: "",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1n1AWZVhnH-Hr_8xmF8PiHdzTHYLGIsRa?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1MxzGEcFlQuweR0XHi7zuBMDuIfn00tcZ?usp=drive_link"
              },
            },
          ],
        },
      },
      2: {
        subjects: {
          term1: [
            {
              id: "probability-statistics-2-cs",
              name: "Probability and Statistics II",
              code: "02-24-00201",
              description: "Advanced statistical methods and probability distributions",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Cat1L5ibgjDAx3qcU8XpKuM2Sp0jIWdA?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/17m-plzdlLyhkjM_TFmcYw5AZyC61yNrx?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL7snZ0LSsq3g6KzD6pdqwU3_Do8WPY4M8&si=1ZMtkTPNNIX7q31M",
                summaries: "https://drive.google.com/drive/folders/1z2c94GAfxG4TdX63ZY_rZSicvEZlrRHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1QRMaP_UgieJRGo5ebwvD_bIu9EMF0SYs?usp=drive_link"
              },
            },
            {
              id: "intro-databases-cs",
              name: "Introduction to Databases",
              code: "02-24-00202",
              description: "Database design, implementation, and management principles",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/10DIqel1WkLIg5YZ1qbT604vRdpVPyLZ6?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1a78X1gWfKKui7qrsGkHvwycayAssG8Le?usp=drive_link",
                videos: "https://youtube.com/playlist?list=PL37D52B7714788190&si=9Qkf5KQWLTXqYKt1",
                summaries: "https://drive.google.com/drive/folders/1vMRqmZ7ID3YIT920N6loq_yJKOQSOG65?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1luaj1L4qB2T3hTcQvwra667abVRXOx9c?usp=drive_link"
              },
            },
            {
              id: "numerical-computations-cs",
              name: "Numerical Computations",
              code: "02-24-00203",
              description: "Numerical methods and computational techniques",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1YerbhXBHp9cLVhuBlsp337xKVS_01139?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1K4WIBD41wo7MP_GwXpo6yfEg-93c2wVM?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1WbNyHrPMQg8aBKK3pEUvBplv7gxzsxHS?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/14RRGt31M6KSQAxypsDQ2sMI_DR939Wy5?usp=drive_link"
              },
            },
            {
              id: "intro-cybersecurity",
              name: "Introduction to Cybersecurity",
              code: "02-24-06201",
              description: "Fundamentals of cybersecurity and information security",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1czNoBYcq9PxtDGhsK0m8PkY3jCermkUJ?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1QFYrLnoJhSwmoiAATSAeFxdMGkaKTu-g?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1hyS7CmYw3pg5LuB2bGi4DDLzEYNkoopm?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/10sjQ3VXB32w3avBJQG60K-kjVT-KRbfh?usp=drive_link"
              },
            },
            {
              id: "number-theory",
              name: "Number Theory",
              code: "02-24-06202",
              description: "Number theory foundations for cryptography",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1kLhhrcZR_-9aZqRkt8R_heUbhjvJC2Au?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1oGBn9RtjfZQ0jHV3LIHKDN1DF8qL_NSz?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/16KrHdQcwdcP1507oSL7MIPoxZBXY9cM3?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1OjK4epFkpr0IDG94LuM7WZjrj2CZv_Kw?usp=drive_link"
              },
            },
            {
              id: "university-elective-1-cs",
              name: "Economy Science",
              code: "HE_005",
              description: "Study of economic principles and their applications",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1_Z4FSE1Dx0oJ9_nxbHoFvn1WP2wN-Iyd?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1LuCRHkTxVc_uKOX7SdVEwcc0WrEL-n2D?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1B_bMKIcqQ4t_PsxDR6-GMUWQOv67AvNK?usp=drive_link",
                summaries: "https://drive.google.com/drive/folders/1qI0ElMk-nNfGv8hH9h3M51Mz9KvEKhIZ?usp=drive_link",
                quizzes: [
                  {
                    id: "ECO_001",
                    name: "الفصل الاول - مقدمة في علم الاقتصاد",
                    code: "ECO_001",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_001.json"
                  },
                  {
                    id: "ECO_002",
                    name: "الفصل الثاني -المشكلة الاقتصادية والنظم الاقتصادية",
                    code: "ECO_002",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_002.json"
                  },
                  {
                    id: "ECO_003",
                    name: "الفصل الثالث - نظرية طلب المستهلك",
                    code: "ECO_003",
                    duration: "OP",
                    questions: 19,
                    jsonFile: "/quizzes/Economic/ECO_003.json"
                  },
                  {
                    id: "ECO_004",
                    name: "الفصل الرابع - العرض في السوق",
                    code: "ECO_004",
                    duration: "OP",
                    questions: 17,
                    jsonFile: "/quizzes/Economic/ECO_004.json"
                  },
                  {
                    id: "ECO_005",
                    name: "الفصل الخامس - التوازن في السوق",
                    code: "ECO_005",
                    duration: "OP",
                    questions: 12,
                    jsonFile: "/quizzes/Economic/ECO_005.json"
                  },
                  {
                    id: "ECO_006",
                    name: "الفصل السادس - مرونات العرض والطلب",
                    code: "ECO_006",
                    duration: "OP",
                    questions: 27,
                    jsonFile: "/quizzes/Economic/ECO_006.json"
                  },
                  {
                    id: "ECO_007",
                    name: "الفصل السابع - نظرية المنفعة الحدية",
                    code: "ECO_007",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_007.json"
                  },
                  {
                    id: "ECO_008",
                    name: "الفصل التاسع - نظرية الإنتاج",
                    code: "ECO_008",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_008.json"
                  },
                  {
                    id: "ECO_009",
                    name: "الفصل العاشر - تكاليف الإنتاج",
                    code: "ECO_009",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_009.json"
                  },
                  {
                    id: "ECO_010",
                    name: "الفصل الحادي عشر - اسواق المنافسة الكاملة",
                    code: "ECO_010",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Economic/ECO_010.json"
                  },
                  {
                    id: "ECO_011",
                    name: "الفصل الثاني عشر - اسواق المنافسة غير الكاملة",
                    code: "ECO_011",
                    duration: "OP",
                    questions: 18,
                    jsonFile: "/quizzes/Economic/ECO_011.json"
                  },
                ],
              },
            },
          ],
          term2: [
            {
              id: "cloud-computing-cs",
              name: "Cloud Computing",
              code: "02-24-00204",
              description: "Cloud platforms, services, and distributed computing concepts",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1P37WAFRKgkokNwr6R5MZNOFEpff5dUIB?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1ny-TP92zjTZrctHIBx_QmsTfl52bSP1Q?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/11QHqhN6G_OmTNZTPdR_OVWzUZ5fEMO8X?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1ICXoWQy7-nas1_KaLNCA_fHKXEVvRqw2?usp=drive_link",
                quizzes: [
                  {
                    id: "CLC_10661",
                    name: "Introduction to Cloud Computing",
                    code: "CLC_10661",
                    duration: "OP", // <-- CHANGED THIS LINE
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10661.json"
                  },
                  {
                    id: "CLC_10662",
                    name: "Platform and Infrastructure Services",
                    code: "CLC_10662",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10662.json"
                  },
                  {
                    id: "CLC_10663",
                    name: "Virtualization",
                    code: "CLC_10663",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10663.json"
                  },
                  {
                    id: "CLC_10664",
                    name: "Parallel Programming",
                    code: "CLC_10664",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10664.json"
                  },
                  {
                    id: "CLC_10665",
                    name: "Distributed Storage Systems",
                    code: "CLC_10665",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10665.json"
                  },
                  {
                    id: "CLC_10666",
                    name: "Cloud Security",
                    code: "CLC_10666",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10666.json"
                  },
                  {
                    id: "CLC_10667",
                    name: "Cloud Performance",
                    code: "CLC_10667",
                    duration: "OP",
                    questions: 30,
                    jsonFile: "/quizzes/cloud computing/CLC_10667.json"
                  },
                  {
                    id: "CLC_10668",
                    name: "General Overview + 20Q of 2025's Midterm",
                    code: "CLC_10668",
                    duration: "OP",
                    questions: 50,
                    jsonFile: "/quizzes/cloud computing/CLC_10668_TOT.json"
                  }
                ],
              },
            },
            {
              id: "machine-learning-cs",
              name: "Machine Learning",
              code: "02-24-00205",
              description: "Supervised and unsupervised learning algorithms and applications",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1CCeA8VUvw__jCBmZ-5Y1J3ujOyir4HSr?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1hO_vvmFpCD9zw4rlK77HIIeNVWpjgM2K?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1XdboKP5n65WZCznnqiCrE0BZfiarSl4Z?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1WI08MEt_kVSuMITdlqqgPaVpTUPwiqgK?usp=drive_link"
              },
            },
            {
              id: "data-mining-analytics-cs",
              name: "Data Mining and Analytics",
              code: "02-24-00206",
              description: "Techniques for extracting knowledge from large datasets",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1Ex-VAzuroLcg0fmSmg-Zd-x6KXCY7P1H?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1yRLzmfdAksXPomOZCRLQLG48sWnkQIDc?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1HRedV6Iu8Djd_f0AE0MigL8nKoq8Yb8-?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1mrKwfr3Mgi9p3zp7VdIVLmsUiPYhJYCX?usp=drive_link",
                quizzes:[
                  {
                    id: "MIG_14331",
                    name: "Data Mining Lecture 1",
                    code: "MIG_14331",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14331.json"
                  },
                  {
                    id: "MIG_14332",
                    name: "Data Mining Lecture 2",
                    code: "MIG_14332",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14332.json"
                  },
                  {
                    id: "MIG_14333",
                    name: "Data Mining Lecture 3",
                    code: "MIG_14333",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14333.json"
                  },
                  {
                    id: "MIG_14334",
                    name: "Data Mining Lecture 4",
                    code: "MIG_14334",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14334.json"
                  },
                  {
                    id: "MIG_14335",
                    name: "Data Mining Lecture 5",
                    code: "MIG_14335",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14335.json"
                  },
                  {
                    id: "MIG_14336",
                    name: "Data Mining Lecture 6",
                    code: "MIG_14336",
                    duration: "OP",
                    questions: 20,
                    jsonFile: "/quizzes/Data Mining/MIG_14336.json"
                  },
                ]
              },
            },
            {
              id: "cryptography",
              name: "Cryptography",
              code: "02-24-06203",
              description: "Cryptographic algorithms and protocols",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1bIkavqwkpzhBJPskiAW9V__EXAUdmGLc?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1OajUBQFN1DTE_OoSUU4biCbVYFmp6FOF?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/1JSmAexFJfF-PErax2AostO_K2GvA04ND?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/17zQOsUJRZtQiePHUQzpsgwcjb4kbZFdl?usp=drive_link",
              },
            },
            {
              id: "operating-systems-cs",
              name: "Operating Systems",
              code: "02-24-0X0XX",
              description: "Fundamentals of operating system design and implementation",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/1EpjZJ58zbMRasFyPNySKmYJuG7b-Bvua?usp=drive_link",
                sections: "https://drive.google.com/drive/folders/1HYW5w49TuHYjjaQolerASZ58QYH7HH48?usp=drive_link",
                videos: "",
                summaries: "https://drive.google.com/drive/folders/12S1na5_w3TYn6AP1xGcz4-MVK4PwuSm_?usp=drive_link",
                exams: "https://drive.google.com/drive/folders/1aS7ppq-ylQ6EAtYcndF_S5dijNKSqY25?usp=drive_link",
              },
            },
          ],
        },
      },
      3: {
        subjects: {
          term1: [
            {
              id: "computer-networks-cs",
              name: "Computer Networks",
              code: "02-24-00308",
              description: "Network protocols and network security fundamentals",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-networks-cs-lectures",
                sections: "https://drive.google.com/drive/folders/computer-networks-cs-sections",
                videos: "https://youtube.com/playlist?list=computer-networks-cs-videos",
              },
            },
            {
              id: "operating-systems-security",
              name: "Operating Systems Security",
              code: "02-24-06302",
              description: "Advanced operating system security mechanisms",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/operating-systems-security-lectures",
                sections: "https://drive.google.com/drive/folders/operating-systems-security-sections",
                videos: "https://youtube.com/playlist?list=operating-systems-security-videos",
              },
            },
            {
              id: "secure-software-development",
              name: "Secure Software Development",
              code: "02-24-06303",
              description: "Secure coding practices and software security",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/secure-software-development-lectures",
                sections: "https://drive.google.com/drive/folders/secure-software-development-sections",
                videos: "https://youtube.com/playlist?list=secure-software-development-videos",
              },
            },
            {
              id: "faculty-elective-cs-1",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-1-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-1-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-1-videos",
              },
            },
            {
              id: "faculty-elective-cs-2",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-2-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-2-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-2-videos",
              },
            },
            {
              id: "university-elective-cs-3",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-3-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-3-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-3-videos",
              },
            },
          ],
          term2: [
            {
              id: "computer-network-security",
              name: "Computer and Network Security",
              code: "02-24-06304",
              description: "Advanced network security and intrusion detection",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/computer-network-security-lectures",
                sections: "https://drive.google.com/drive/folders/computer-network-security-sections",
                videos: "https://youtube.com/playlist?list=computer-network-security-videos",
              },
            },
            {
              id: "data-integrity-authentication",
              name: "Data Integrity and Authentication",
              code: "02-24-06305",
              description: "Data protection and authentication mechanisms",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/data-integrity-authentication-lectures",
                sections: "https://drive.google.com/drive/folders/data-integrity-authentication-sections",
                videos: "https://youtube.com/playlist?list=data-integrity-authentication-videos",
              },
            },
            {
              id: "information-security-management",
              name: "Information Security Management",
              code: "02-24-06306",
              description: "Security governance and risk management",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/information-security-management-lectures",
                sections: "https://drive.google.com/drive/folders/information-security-management-sections",
                videos: "https://youtube.com/playlist?list=information-security-management-videos",
              },
            },
            {
              id: "faculty-elective-cs-3",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-3-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-3-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-3-videos",
              },
            },
            {
              id: "faculty-elective-cs-4",
              name: "Faculty Elective",
              code: "02-24-0X0XX",
              description: "Specialized faculty elective course",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/faculty-elective-cs-4-lectures",
                sections: "https://drive.google.com/drive/folders/faculty-elective-cs-4-sections",
                videos: "https://youtube.com/playlist?list=faculty-elective-cs-4-videos",
              },
            },
          ],
        },
      },
      4: {
        subjects: {
          term1: [
            {
              id: "social-network-computing",
              name: "Social Network Computing",
              code: "02-24-06401",
              description: "Security and privacy in social networks",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/social-network-computing-lectures",
                sections: "https://drive.google.com/drive/folders/social-network-computing-sections",
                videos: "https://youtube.com/playlist?list=social-network-computing-videos",
              },
            },
            {
              id: "security-distributed-systems",
              name: "Security of Distributed Systems",
              code: "02-24-06402",
              description: "Security challenges in distributed computing environments",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/security-distributed-systems-lectures",
                sections: "https://drive.google.com/drive/folders/security-distributed-systems-sections",
                videos: "https://youtube.com/playlist?list=security-distributed-systems-videos",
              },
            },
            {
              id: "human-security",
              name: "Human Security",
              code: "02-24-06403",
              description: "Human factors in cybersecurity and social engineering",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/human-security-lectures",
                sections: "https://drive.google.com/drive/folders/human-security-sections",
                videos: "https://youtube.com/playlist?list=human-security-videos",
              },
            },
            {
              id: "program-elective-cs-1",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-1-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-1-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-1-videos",
              },
            },
            {
              id: "program-elective-cs-2",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-2-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-2-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-2-videos",
              },
            },
            {
              id: "university-elective-cs-4",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-4-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-4-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-4-videos",
              },
            },
          ],
          term2: [
            {
              id: "cybersecurity-risk-management",
              name: "Cybersecurity Risk Management",
              code: "02-24-06405",
              description: "Risk assessment and management in cybersecurity",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/cybersecurity-risk-management-lectures",
                sections: "https://drive.google.com/drive/folders/cybersecurity-risk-management-sections",
                videos: "https://youtube.com/playlist?list=cybersecurity-risk-management-videos",
              },
            },
            {
              id: "digital-forensics",
              name: "Digital Forensics",
              code: "02-24-06406",
              description: "Digital evidence collection and forensic analysis",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/digital-forensics-lectures",
                sections: "https://drive.google.com/drive/folders/digital-forensics-sections",
                videos: "https://youtube.com/playlist?list=digital-forensics-videos",
              },
            },
            {
              id: "law-cybersecurity",
              name: "Law and Cybersecurity",
              code: "02-24-06407",
              description: "Legal aspects of cybersecurity and cyber law",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/law-cybersecurity-lectures",
                sections: "https://drive.google.com/drive/folders/law-cybersecurity-sections",
                videos: "https://youtube.com/playlist?list=law-cybersecurity-videos",
              },
            },
            {
              id: "program-elective-cs-3",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 3,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-3-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-3-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-3-videos",
              },
            },
            {
              id: "program-elective-cs-4",
              name: "Program Elective",
              code: "02-24-064XX",
              description: "Specialized cybersecurity program elective",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/program-elective-cs-4-lectures",
                sections: "https://drive.google.com/drive/folders/program-elective-cs-4-sections",
                videos: "https://youtube.com/playlist?list=program-elective-cs-4-videos",
              },
            },
            {
              id: "university-elective-cs-5",
              name: "University Elective",
              code: "02-0X-000XX",
              description: "University-wide elective course",
              creditHours: 2,
              materials: {
                lectures: "https://drive.google.com/drive/folders/university-elective-cs-5-lectures",
                sections: "https://drive.google.com/drive/folders/university-elective-cs-5-sections",
                videos: "https://youtube.com/playlist?list=university-elective-cs-5-videos",
              },
            },
          ],
        },
      },
    },
  },
}
