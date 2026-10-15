function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-box">
            <p>⚠️ {message}</p>
            {onRetry && (
                <button className="btn" onClick={onRetry}>
                    Try again
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;