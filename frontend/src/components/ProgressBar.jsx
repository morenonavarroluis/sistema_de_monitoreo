export const ProgressBar = ({ progress }) => (
    <div className="mt-6 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
        />
    </div>
);