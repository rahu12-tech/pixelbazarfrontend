export default function Page404() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            {/* Breadcrumb */}
            <div className="w-full max-w-4xl mb-10 text-sm text-gray-500">
                Home <span className="mx-1">/</span>{" "}
                <span className="text-black font-medium">404 Error</span>
            </div>

            {/* 404 Content */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6">404 Not Found</h1>
            <p className="text-gray-600 mb-10 text-center">
                Your visited page not found. You may go home page.
            </p>

            {/* Back Button */}
            <button
                onClick={() => (window.location.href = "/")}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
            >
                Back to home page
            </button>
        </div>
    );
}
