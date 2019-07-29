export const successRequest = ({ onSuccess, file }: {onSuccess: Function, file: File}) => {
  setTimeout(() => {
    onSuccess(null, file);
  });
};

export const errorRequest = ({ onError }: {onError: Function}) => {
  setTimeout(() => {
    onError();
  });
};
