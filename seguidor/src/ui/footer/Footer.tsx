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
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-semibold">Enlaces útiles</h4>
            <ul className="list-none"> 
              <li><a href="#about" className="text-danger-500 hover:underline">Alertar Error</a></li>
              <li><a href="#services" className="text-blue-400 hover:underline">Servicios</a></li>
              <li><a href="#contact" className="text-blue-400 hover:underline">Contacto</a></li>
            </ul>
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
