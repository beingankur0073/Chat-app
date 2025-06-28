const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.CLIENT_URL // This must be correctly set on Render
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"], // <--- Added OPTIONS and HEAD
    credentials: true,
    optionsSuccessStatus: 204 // <--- Added this for proper preflight response
}

const CHATTU_TOKEN = "chattu-token"

export { corsOptions, CHATTU_TOKEN }