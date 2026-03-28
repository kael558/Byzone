import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { FaArrowUp } from "react-icons/fa";


const BackToTop = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
		const handleScroll = () => {
			setShowBackToTop(window.pageYOffset > 300);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const backToTopAnimation = useSpring({
		opacity: showBackToTop ? 1 : 0,
		transform: showBackToTop ? "translateY(0)" : "translateY(100px)",
		config: config.wobbly,
	});

    return (
        <animated.button
				style={backToTopAnimation}
				onClick={scrollToTop}
				className="fixed bottom-8 right-8 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
				aria-label="Back to top"
			>
				<FaArrowUp />
			</animated.button>
    );
}

export default BackToTop;