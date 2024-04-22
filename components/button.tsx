const Button = ({ text, loading }: { text: string; loading: boolean }) => (
	<input
		type="submit"
		value={text}
		disabled={loading}
		className="py-3 bg-sky-500 text-white w-full rounded-lg hover:bg-sky-400"
	/>
);

export default Button;
