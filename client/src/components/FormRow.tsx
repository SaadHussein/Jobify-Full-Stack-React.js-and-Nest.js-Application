const FormRow = ({
  type,
  name,
  labelText,
  defaultValue = "",
}: {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: string;
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
      />
    </div>
  );
};
export default FormRow;
