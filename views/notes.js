userCerts = [
  {
    id: "S-212",
    metadata: {
      cred: "A",
      issued: "07-2023",
      expiry: "",
      body: "",
      notes:""
    }
    image: "",
  },
  {
    id: "Driver's license",
    metadata: {
      cred: "99-999",
      issued: "01-2020",
      expiry: "01-2025",
      body: "CO",
      notes:"Airbrake endorsement"
    }
    image: "",
  },
  {
    id: "S-130/190, L180",
    metadata: {
      cred: "",
      issued: "01-2023",
      expiry: "01-2024",
      body: "",
      notes:""
    }
    image: "",
  }
]

pageCerts = [userInfo, emergencyInfo, ..userCerts, addCert]