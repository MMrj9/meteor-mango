// GenericForm.tsx
import React from 'react';
import { useFormik } from 'formik';
import {
    Input,
    Textarea,
    FormControl,
    FormLabel,
    Button,
} from '@chakra-ui/react';

interface GenericFormProps<T> {
    initialValues: T;
    onSubmit: (values: T) => void;
    formFields: any;
}


const GenericForm = <T extends Record<string, any>>({
    initialValues,
    onSubmit,
    formFields,
}: GenericFormProps<T>) => {

    const formik = useFormik({
        initialValues,
        onSubmit,
        enableReinitialize: true,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            {Object.entries(formFields).map(([fieldName, fieldConfig]) => {
                const { type = 'text', label } = fieldConfig as any;

                return (
                    <FormControl key={fieldName}>
                        <FormLabel>{label}</FormLabel>
                        {type === 'textarea' ? (
                            <Textarea
                                name={fieldName}
                                value={formik.values[fieldName]}
                                onChange={formik.handleChange}
                                // Spread formik here to bind the value and onChange properly
                                {...formik}
                            />
                        ) : type === 'number' ? (
                            <Input
                                type="number"
                                name={fieldName}
                                value={formik.values[fieldName]}
                                onChange={formik.handleChange}
                                // Spread formik here to bind the value and onChange properly
                                {...formik}
                            />
                        ) : (
                            <Input
                                type={type}
                                name={fieldName}
                                value={formik.values[fieldName]}
                                onChange={formik.handleChange}
                                // Spread formik here to bind the value and onChange properly
                                {...formik}
                            />
                        )}
                    </FormControl>
                );
            })}

            <Button mt={4} colorScheme="teal" type="submit">
                Save
            </Button>
        </form>
    );
};


export default GenericForm;