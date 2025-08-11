interface HandleOAuthCallbackProps {
  code: string;
  setError: (error: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}
