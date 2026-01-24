export const clerkAppearance = {
  variables: {
    colorBackground: "#171717",
    colorPrimary: "#a3ff19",
    colorPrimaryForeground: "#222",
    colorForeground: "#fff",
    colorText: "#fff",
    colorTextOnPrimaryBackground: "#222",
    colorTextSecondary: "#ccc",
    colorInput: "#222",
    colorInputText: "#fff",
    colorBorder: "#333",
    fontSize: "14px",
  },
  elements: {
    // Card styling
    cardBox: {
      boxShadow: "none",
      width: "500px",
    },
    card: {
      width: "100%",
    },

    // Form inputs
    formFieldInput: {
      backgroundColor: "#222",
      color: "#fff",
      border: "2px solid #fff",
      height: "35px",
      transition: "all 0.3s ease",
    },
    formFieldLabel: { color: "#eee" },

    // Primary button
    formButtonPrimary: {
      background: "#a3ff19",
      color: "#333",
      border: "none",
      boxShadow: "0 0 10px #39FF14, 0 0 20px #39FF14",
      fontWeight: 700,
    },

    // Social buttons
    socialButtonsBlockButton__google: {
      backgroundColor: "#222",
      transition: "all 0.2s",
      width: "420px",
      height: "40px",
      margin: "0 auto",
    },
    socialButtonsBlockButtonText: {
      color: "#fff",
    },

    // Password visibility icons
    formFieldInputShowPasswordIcon: {
      color: "#fff",
      border: "none",
      outline: "none",
      "&:hover": {
        color: "#a3ff19",
      },
    },
    formFieldInputHidePasswordIcon: {
      color: "#fff",
      border: "none",
      outline: "none",
      "&:hover": {
        color: "#a3ff19",
      },
    },

    // OTP code inputs
    otpCodeFieldInput: {
      backgroundColor: "#222",
      color: "#fff",
      border: "2px solid #fff",
      borderRadius: "8px",
      width: "50px",
      height: "50px",
      fontSize: "18px",
      textAlign: "center" as const,
      margin: "0 5px",
      transition: "all 0.3s ease",
    },
    otpCodeFieldInputs: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    verificationCodeInput: {
      backgroundColor: "#222",
      color: "#fff",
      border: "2px solid #fff",
      borderRadius: "8px",
      width: "50px",
      height: "50px",
      fontSize: "18px",
      textAlign: "center" as const,
      transition: "all 0.3s ease",
    },

    // User button dropdown styling
    userButtonPopoverCard: {
      backgroundColor: "#171717",
      border: "1px solid #333",
    },
    userButtonPopoverActionButton: {
      color: "#fff",
      transition: "all 0.2s",
      "&:hover": {
        color: "#a3ff19",
        backgroundColor: "#222",
      },
    },
    userButtonPopoverActionButtonText: {
      color: "inherit",
    },
    userButtonPopoverActionButtonIcon: {
      color: "inherit",
    },
    userButtonPopoverFooter: {
      display: "none",
    },
    userPreviewMainIdentifier: {
      color: "#fff",
    },
    userPreviewSecondaryIdentifier: {
      color: "#ccc",
    },
  },
};
