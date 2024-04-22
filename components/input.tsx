const InputField = ({
	type,
	placeholder,
	register,
	name,
	validation,
	error,
}: {
	type: string;
	placeholder: string;
	name: string;
	register: any;
	validation: any;
	error: any;
}) => (
	<div className="mt-5">
		<input
			type={type}
			className="block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
			placeholder={placeholder}
			{...register(name, validation)}
		/>
		<span className="text-purple-600">{error}</span>
	</div>
);

export default InputField;
