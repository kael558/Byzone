import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';

function App() {
	return (
		<div className="flex flex-col min-h-screen bg-white">
			<NavigationBar />
			<main className="flex-grow">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
