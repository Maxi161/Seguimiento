import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[rgb(14,14,14)] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-semibold">Funcionalidad</h4>
            <p>Página desarrollada como proyecto personal para el seguimiento laboral</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Contacto</h4>
            <p>Email: olea.maximo17@gmail.com</p>
            <p>Teléfono: +54 3813040830</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
