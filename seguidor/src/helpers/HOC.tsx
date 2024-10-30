// withAuthProtection.tsx
import React, { ComponentType, useEffect } from 'react';
import { useUserContext } from "@/context/user.context";
import { useRouter } from "next/navigation";

const withAuthProtection = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthProtectedComponent: React.FC<P> = (props) => {
    const { isLogged, user } = useUserContext();
    const router = useRouter();

    useEffect(() => {
      if (!isLogged) {
        console.log(isLogged);
        console.log(user);
        router.push("/auth");
      }
    }, [isLogged, router, user]);
    //! TENES QUE FIJARTE PORQUÉ TE MANDA SIEMPRE AL AUTH, NO ESTA GUARDANDO UNA VERGA EN EL LOCAL STORAGE O
    //! SE ELIMINA CUANDO CAMBIAS MANUALMENTE DE PÁGINA O VISTA MEDIANTE LA URL, por lo que no funciona na :3
        if (!isLogged) {
      return null; // O puedes mostrar un loader mientras rediriges
    }

    return <WrappedComponent {...props} />;
  };

  return AuthProtectedComponent;
};

export default withAuthProtection;
