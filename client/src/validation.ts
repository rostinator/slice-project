import * as yup from 'yup';

yup.setLocale({
    mixed: {
        required: 'yup.mixed.required'
    },
    string: {
        email: 'yup.string.email',
        min: 'yup.string.min',
        max: 'yup.string.max'
    }
});

export default yup;