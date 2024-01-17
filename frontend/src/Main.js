import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import App from "./App"
import Chat from "./Chat"


function Main() {

    return (
        <div>
            <Router>
                <Routes>
                    <Route path='/'element={<App />} />
                    <Route path='/room/:id'element={<Chat />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Main