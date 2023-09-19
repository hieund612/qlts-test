import React from "react";
import Select, { StylesConfig } from "react-select";
import { useFormikContext, useField } from "formik";
type MyOption = {
  label: string;
  value: any;
};
//define the group option type
type GroupedOption = {
  label: string; // group label
  options: MyOption[];
};
type ColourOption = {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
};

export const TanetSelect = (props: Props) => {
  const { name, label, view, required, ...restProps } = props;
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  //flatten the options so that it will be easier to find the value
  const flattenedOptions = props.options?.flatMap((o: any) => {
    const isNotGrouped = "value" in o;
    if (isNotGrouped) {
      return o;
    } else {
      return o.options;
    }
  });

  //get the value using flattenedOptions and field.value
  const value = flattenedOptions?.filter((o: any) => {
    const isArrayValue = Array.isArray(field.value);
    if (isArrayValue) {
      const values = field.value as Array<any>;
      return values.includes(o.value);
    } else {
      return field.value === o.value;
    }
  });
  const colourStyles: StylesConfig<ColourOption> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: view && "rgb(229, 231, 235)",
      color: "rgb(17, 24, 39)",
    }),
    option: (styles, { data, isDisabled }) => {
      return {
        ...styles,
        color: isDisabled ? "#00B8D9" : "#000",
        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
  };
  return (
    <div>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
          {required ? <span className="text-red-500"> (*)</span> : ""}
        </label>
      )}

      <Select
        {...restProps}
        isDisabled={view}
        className={`block ${
          label && "mt-2"
        } w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
          view && "cursor-not-allowed bg-gray-200"
        }`}
        value={value}
        styles={colourStyles}
        isClearable={true}
        // onChange implementation
        onChange={(val) => {
          //here I used explicit typing but there maybe a better way to type the value.
          if (val) {
            const _val = val as MyOption[] | MyOption;
            const isArray = Array.isArray(_val);
            if (isArray) {
              const values = _val.map((o) => o.value);
              setFieldValue(name, values);
              if (props.onChange) {
                props.onChange({
                  persist: () => {},
                  target: {
                    type: "change",
                    id: props.id || null,
                    name: props.name,
                    value: values,
                  },
                });
              }
            } else {
              setFieldValue(name, _val.value);
              if (props.onChange) {
                props.onChange({
                  persist: () => {},
                  target: {
                    type: "change",
                    id: props.id || null,
                    name: props.name,
                    value: _val.value,
                  },
                });
              }
            }
          } else {
            setFieldValue(name, null);
            if (props.onChange) {
              props.onChange({
                persist: () => {},
                target: {
                  type: "change",
                  id: props.id || null,
                  name: props.name,
                  value: null,
                },
              });
            }
          }
        }}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </div>
  );
};
