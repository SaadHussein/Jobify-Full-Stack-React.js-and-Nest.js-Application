const FormRow = ({
  type,
  name,
  labelText,
  defaultValue = '',
  onChange,
}: {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className="form-input"
        defaultValue={defaultValue}
        required
        onChange={onChange}
      />
    </div>
  );
};
export default FormRow;
