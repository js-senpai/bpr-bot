export const validateNameSurname = (input: string) => {
  const nameSurnameRegex =
    /^[a-zA-Zа-яА-ЯҐґЄєІіЇї]+([-']?[a-zA-Zа-яА-ЯҐґЄєІіЇї]+)?\s[a-zA-Zа-яА-ЯҐґЄєІіЇї]+([-']?[a-zA-Zа-яА-ЯҐґЄєІіЇї]+)?$/;
  return nameSurnameRegex.test(input);
};
