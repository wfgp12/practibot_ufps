import LogoUFPS from "@/assets/Logo_BLANCO.png";
import LogoCO from "@/assets/LogoCO.png";
import LogoGOV from "@/assets/logoGov.png";

const Footer = () => {
  return (
    <footer className="w-full bg-[#272727] text-gray-200 text-sm pt-10 pb-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo y entidades */}
        <div className="flex flex-col items-center md:items-start gap-4 sm:flex-row md:flex-col sm:justify-center">
          <img src={LogoUFPS} alt="UFPS" className="h-50 object-contain" />
          <img src={LogoCO} alt="CO Colombia" className="h-30 object-contain" />
          <img src={LogoGOV} alt="GOV.CO" className="h-16 object-contain mt-2 md:mt-4" />
        </div>

        {/* Portales Institucionales */}
        <div className="w-full text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-3 border-b border-red-600 inline-block">
            Portales Institucionales
          </h3>
          <ul className="space-y-1">
            <li><a href="https://divisist2.ufps.edu.co/" className="hover:text-red-400">Divisist</a></li>
            <li><a href="https://acceso.ufps.edu.co/" className="hover:text-red-400">Pagos de Egresados y Externos</a></li>
            <li><a href="http://dptosist.ufps.edu.co/piagev1/servlet/piagev" className="hover:text-red-400">Piagev</a></li>
            <li><a href="https://ww2.ufps.edu.co/universidad/atencion_ciudadano" className="hover:text-red-400">PQRSDF</a></li>
            <li><a href="http://ugad.ufps.edu.co:8084/datarsoft001/home.ufps" className="hover:text-red-400">DataSoft</a></li>
            <li><a href="http://nomina.ufps.edu.co:9191/nominaufps" className="hover:text-red-400">Sistema de Nómina</a></li>
            <li><a href="http://www.ufps.edu.co/ufps/cread/Presentacion.php" className="hover:text-red-400">DISERACA</a></li>
          </ul>
        </div>

        {/* Enlaces de interés */}
        <div className="w-full text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-3 border-b border-red-600 inline-block">
            Enlaces de interés
          </h3>
          <ul className="space-y-1">
            <li><a href="https://ww2.ufps.edu.co/universidad/planeacion/655" className="hover:text-red-400">Plan Anticorrupción</a></li>
            <li><a href="https://ww2.ufps.edu.co/universidad/seleccion" className="hover:text-red-400">Proceso de selección</a></li>
            <li><a href="https://ww2.ufps.edu.co/universidad/contratacion/1122" className="hover:text-red-400">Contratación</a></li>
            <li><a href="https://ww2.ufps.edu.co/informacion/proceso-democratico-2024" className="hover:text-red-400">Proceso democrático</a></li>
            <li><a href="https://ww2.ufps.edu.co/vicerrectoria/vicerrectoria-administrativa/527" className="hover:text-red-400">Derechos pecuniarios</a></li>
            <li><a href="https://mail.google.com/a/ufps.edu.co/" className="hover:text-red-400">Correo Electrónico Institucional</a></li>
            <li><a href="https://ww2.ufps.edu.co/universidad/consultorio-juridico/1156" className="hover:text-red-400">Consultorio Jurídico</a></li>
            <li><a href="https://ingminas.ufps.edu.co/" className="hover:text-red-400">Consultorio Técnico Minero</a></li>
            <li><a href="https://ww2.ufps.edu.co/universidad/centro-conciliacion/2543" className="hover:text-red-400">Centro de Conciliación</a></li>
            <li><a href="https://ww2.ufps.edu.co/public/archivos/pdf/c791a607b28af1e1f4e37d11a7d872f6.pdf" className="hover:text-red-400">Términos y Condiciones</a></li>
            <li><a href="https://ww2.ufps.edu.co/universidad/transparencia_acceso_informacion_publica/2739" className="hover:text-red-400">Transparencia y Acceso a la Información Pública</a></li>
            <li><a href="https://ww2.ufps.edu.co/universidad/transparencia_acceso_informacion_publica/2934" className="hover:text-red-400">Certificados</a></li>
          </ul>
        </div>

        {/* Contactos */}
        <div className="w-full text-center md:text-left">
          <h3 className="text-lg font-semibold text-white mb-3 border-b border-red-600 inline-block">
            Contactos
          </h3>
          <p className="text-gray-400">
            Avenida Gran Colombia No. 12E-96 Barrio Colsag<br />
            San José de Cúcuta - Colombia<br />
            Teléfono: (057)(7) 5776655
          </p>
          <div className="mt-3 space-y-1">
            <p>Solicitudes y correspondencia:</p>
            <a href="mailto:ugad@ufps.edu.co" className="text-red-400 hover:underline">
              ugad@ufps.edu.co
            </a>
            <p>Notificaciones judiciales:</p>
            <a href="mailto:notificacionesjudiciales@ufps.edu.co" className="text-red-400 hover:underline">
              notificacionesjudiciales@ufps.edu.co
            </a>
          </div>
        </div>
      </div>

      {/* Footer inferior */}
      <div className="text-center border-t border-gray-700 mt-8 pt-4 text-gray-400 text-xs">
        © {new Date().getFullYear()} Prácticas UFPS. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
