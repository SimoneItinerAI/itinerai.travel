import { useEffect, useRef, useState } from 'react';
import DestinationTypewriter from './DestinationTypewriter';
import TravelDateSelector from './TravelDateSelector';

import { type ItineraryParams } from '../utils/itinerary';
import { ArrowRight, Users } from 'lucide-react';

export default function Hero({ onStart, onDatePickerToggle, datePickerState }: { 
  onStart?: (p: ItineraryParams) => void, 
  onDatePickerToggle?: (isOpen: boolean) => void,
  datePickerState?: {
    isOpen: boolean;
    startDate: string;
    endDate: string;
    days: number;
  }
}) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(datePickerState?.days || 3);
  const [people, setPeople] = useState(2);
  const [travelDates, setTravelDates] = useState({
    startDate: datePickerState?.startDate || '',
    endDate: datePickerState?.endDate || '',
    days: datePickerState?.days || 3
  });

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<{ name: string; flag: string }[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // Popular destinations with country flags - comprehensive list
  const DESTINATIONS_WITH_FLAGS = [
    // Italia 🇮🇹 - Città principali
    { name: "Roma", flag: "🇮🇹" }, { name: "Milano", flag: "🇮🇹" }, { name: "Firenze", flag: "🇮🇹" }, { name: "Venezia", flag: "🇮🇹" }, { name: "Napoli", flag: "🇮🇹" }, { name: "Torino", flag: "🇮🇹" }, { name: "Bologna", flag: "🇮🇹" }, { name: "Verona", flag: "🇮🇹" }, { name: "Palermo", flag: "🇮🇹" }, { name: "Genova", flag: "🇮🇹" },
    { name: "Bari", flag: "🇮🇹" }, { name: "Catania", flag: "🇮🇹" }, { name: "Padova", flag: "🇮🇹" }, { name: "Trieste", flag: "🇮🇹" }, { name: "Brescia", flag: "🇮🇹" }, { name: "Parma", flag: "🇮🇹" }, { name: "Modena", flag: "🇮🇹" }, { name: "Reggio Emilia", flag: "🇮🇹" }, { name: "Perugia", flag: "🇮🇹" }, { name: "Livorno", flag: "🇮🇹" },
    { name: "Ravenna", flag: "🇮🇹" }, { name: "Cagliari", flag: "🇮🇹" }, { name: "Foggia", flag: "🇮🇹" }, { name: "Rimini", flag: "🇮🇹" }, { name: "Salerno", flag: "🇮🇹" }, { name: "Ferrara", flag: "🇮🇹" }, { name: "Sassari", flag: "🇮🇹" }, { name: "Latina", flag: "🇮🇹" }, { name: "Giugliano in Campania", flag: "🇮🇹" }, { name: "Monza", flag: "🇮🇹" },
    { name: "Siracusa", flag: "🇮🇹" }, { name: "Pescara", flag: "🇮🇹" }, { name: "Udine", flag: "🇮🇹" }, { name: "Messina", flag: "🇮🇹" }, { name: "Taranto", flag: "🇮🇹" }, { name: "Trento", flag: "🇮🇹" }, { name: "Novara", flag: "🇮🇹" }, { name: "Ancona", flag: "🇮🇹" }, { name: "Andria", flag: "🇮🇹" }, { name: "Arezzo", flag: "🇮🇹" },
    { name: "Bolzano", flag: "🇮🇹" }, { name: "Pisa", flag: "🇮🇹" }, { name: "Piacenza", flag: "🇮🇹" }, { name: "Catanzaro", flag: "🇮🇹" }, { name: "La Spezia", flag: "🇮🇹" }, { name: "Vicenza", flag: "🇮🇹" }, { name: "Forlì", flag: "🇮🇹" }, { name: "Terni", flag: "🇮🇹" }, { name: "Lecce", flag: "🇮🇹" }, { name: "Varese", flag: "🇮🇹" },
    { name: "Bergamo", flag: "🇮🇹" }, { name: "Casoria", flag: "🇮🇹" }, { name: "Pistoia", flag: "🇮🇹" }, { name: "Como", flag: "🇮🇹" }, { name: "Treviso", flag: "🇮🇹" }, { name: "Busto Arsizio", flag: "🇮🇹" }, { name: "Marsala", flag: "🇮🇹" }, { name: "Sesto San Giovanni", flag: "🇮🇹" }, { name: "Grosseto", flag: "🇮🇹" }, { name: "Pavia", flag: "🇮🇹" },
    { name: "Cremona", flag: "🇮🇹" }, { name: "Trapani", flag: "🇮🇹" }, { name: "Carpi", flag: "🇮🇹" }, { name: "Pesaro", flag: "🇮🇹" }, { name: "Fano", flag: "🇮🇹" }, { name: "Legnano", flag: "🇮🇹" }, { name: "Cerignola", flag: "🇮🇹" }, { name: "Imola", flag: "🇮🇹" }, { name: "Benevento", flag: "🇮🇹" }, { name: "Reggio Calabria", flag: "🇮🇹" },
    { name: "Altamura", flag: "🇮🇹" }, { name: "Faenza", flag: "🇮🇹" }, { name: "Sanremo", flag: "🇮🇹" }, { name: "Viterbo", flag: "🇮🇹" }, { name: "Massa", flag: "🇮🇹" }, { name: "Cosenza", flag: "🇮🇹" }, { name: "Savona", flag: "🇮🇹" }, { name: "Agrigento", flag: "🇮🇹" }, { name: "Cuneo", flag: "🇮🇹" }, { name: "Molfetta", flag: "🇮🇹" },
    { name: "Avellino", flag: "🇮🇹" }, { name: "Potenza", flag: "🇮🇹" }, { name: "Lucca", flag: "🇮🇹" }, { name: "Crotone", flag: "🇮🇹" }, { name: "Frosinone", flag: "🇮🇹" }, { name: "Asti", flag: "🇮🇹" }, { name: "Ascoli Piceno", flag: "🇮🇹" }, { name: "Chieti", flag: "🇮🇹" }, { name: "Voghera", flag: "🇮🇹" }, { name: "Mantova", flag: "🇮🇹" },
    { name: "Vibo Valentia", flag: "🇮🇹" }, { name: "Alessandria", flag: "🇮🇹" }, { name: "Vittoria", flag: "🇮🇹" }, { name: "Pordenone", flag: "🇮🇹" }, { name: "Carrara", flag: "🇮🇹" }, { name: "Olbia", flag: "🇮🇹" }, { name: "Barletta", flag: "🇮🇹" }, { name: "Brindisi", flag: "🇮🇹" }, { name: "Ragusa", flag: "🇮🇹" }, { name: "Lamezia Terme", flag: "🇮🇹" },
    { name: "Rovigo", flag: "🇮🇹" }, { name: "Bracciano", flag: "🇮🇹" }, { name: "Scafati", flag: "🇮🇹" }, { name: "Afragola", flag: "🇮🇹" }, { name: "Castellammare di Stabia", flag: "🇮🇹" }, { name: "Torre del Greco", flag: "🇮🇹" }, { name: "Caserta", flag: "🇮🇹" }, { name: "Bitonto", flag: "🇮🇹" }, { name: "Nola", flag: "🇮🇹" }, { name: "Marano di Napoli", flag: "🇮🇹" },
    { name: "Torre Annunziata", flag: "🇮🇹" }, { name: "Carate Brianza", flag: "🇮🇹" }, { name: "Manfredonia", flag: "🇮🇹" }, { name: "Anzio", flag: "🇮🇹" }, { name: "Ardea", flag: "🇮🇹" }, { name: "Ercolano", flag: "🇮🇹" }, { name: "Portici", flag: "🇮🇹" }, { name: "Acerra", flag: "🇮🇹" }, { name: "Pomezia", flag: "🇮🇹" }, { name: "Battipaglia", flag: "🇮🇹" },
    { name: "San Severo", flag: "🇮🇹" }, { name: "Acireale", flag: "🇮🇹" }, { name: "Gravina in Puglia", flag: "🇮🇹" }, { name: "Mazara del Vallo", flag: "🇮🇹" }, { name: "Bagheria", flag: "🇮🇹" }, { name: "Guidonia Montecelio", flag: "🇮🇹" }, { name: "Quartu Sant'Elena", flag: "🇮🇹" }, { name: "Caltanissetta", flag: "🇮🇹" }, { name: "Ragusa", flag: "🇮🇹" }, { name: "Gela", flag: "🇮🇹" },
    { name: "Modica", flag: "🇮🇹" }, { name: "Vittoria", flag: "🇮🇹" }, { name: "Fiumicino", flag: "🇮🇹" }, { name: "Aprilia", flag: "🇮🇹" }, { name: "Alghero", flag: "🇮🇹" }, { name: "Oristano", flag: "🇮🇹" }, { name: "Carbonia", flag: "🇮🇹" }, { name: "Iglesias", flag: "🇮🇹" }, { name: "Porto Torres", flag: "🇮🇹" }, { name: "Tempio Pausania", flag: "🇮🇹" },
    { name: "Nuoro", flag: "🇮🇹" }, { name: "Olbia", flag: "🇮🇹" }, { name: "La Maddalena", flag: "🇮🇹" }, { name: "Arzachena", flag: "🇮🇹" }, { name: "Orosei", flag: "🇮🇹" }, { name: "Dorgali", flag: "🇮🇹" }, { name: "Cala Gonone", flag: "🇮🇹" }, { name: "Santa Teresa Gallura", flag: "🇮🇹" }, { name: "Palau", flag: "🇮🇹" }, { name: "Budoni", flag: "🇮🇹" },
    { name: "San Teodoro", flag: "🇮🇹" }, { name: "Posada", flag: "🇮🇹" }, { name: "Siniscola", flag: "🇮🇹" }, { name: "Galtellì", flag: "🇮🇹" }, { name: "Irgoli", flag: "🇮🇹" }, { name: "Onifai", flag: "🇮🇹" }, { name: "Loculi", flag: "🇮🇹" }, { name: "Tortolì", flag: "🇮🇹" }, { name: "Arbatax", flag: "🇮🇹" },
    { name: "Lanusei", flag: "🇮🇹" }, { name: "Ilbono", flag: "🇮🇹" }, { name: "Villagrande Strisaili", flag: "🇮🇹" }, { name: "Arzana", flag: "🇮🇹" }, { name: "Cardedu", flag: "🇮🇹" }, { name: "Bari Sardo", flag: "🇮🇹" }, { name: "Tertenia", flag: "🇮🇹" }, { name: "Jerzu", flag: "🇮🇹" }, { name: "Ulassai", flag: "🇮🇹" }, { name: "Osini", flag: "🇮🇹" },
    { name: "Gairo", flag: "🇮🇹" }, { name: "Tacchi", flag: "🇮🇹" }, { name: "Seui", flag: "🇮🇹" }, { name: "Seulo", flag: "🇮🇹" }, { name: "Sadali", flag: "🇮🇹" }, { name: "Esterzili", flag: "🇮🇹" }, { name: "Isili", flag: "🇮🇹" }, { name: "Lunamatrona", flag: "🇮🇹" }, { name: "Villanovaforru", flag: "🇮🇹" }, { name: "Collinas", flag: "🇮🇹" },
    { name: "Gonnosfanadiga", flag: "🇮🇹" }, { name: "Pabillonis", flag: "🇮🇹" }, { name: "Samassi", flag: "🇮🇹" }, { name: "Serramanna", flag: "🇮🇹" }, { name: "Villacidro", flag: "🇮🇹" }, { name: "Sanluri", flag: "🇮🇹" }, { name: "Sardara", flag: "🇮🇹" }, { name: "Guspini", flag: "🇮🇹" }, { name: "Arbus", flag: "🇮🇹" },
    { name: "Fluminimaggiore", flag: "🇮🇹" }, { name: "Buggerru", flag: "🇮🇹" }, { name: "Gonnesa", flag: "🇮🇹" }, { name: "Portoscuso", flag: "🇮🇹" }, { name: "Carbonia", flag: "🇮🇹" }, { name: "Perdaxius", flag: "🇮🇹" }, { name: "Tratalias", flag: "🇮🇹" }, { name: "Piscinas", flag: "🇮🇹" }, { name: "Scivu", flag: "🇮🇹" }, { name: "Ingurtosu", flag: "🇮🇹" },
    { name: "Montevecchio", flag: "🇮🇹" }, { name: "Arbus", flag: "🇮🇹" }, { name: "Gonnosnò", flag: "🇮🇹" }, { name: "Villanovaforru", flag: "🇮🇹" }, { name: "San Gavino Monreale", flag: "🇮🇹" }, { name: "Pimentel", flag: "🇮🇹" }, { name: "Barumini", flag: "🇮🇹" }, { name: "Tuili", flag: "🇮🇹" }, { name: "Turri", flag: "🇮🇹" }, { name: "Ussaramanna", flag: "🇮🇹" },
    { name: "Villamar", flag: "🇮🇹" }, { name: "Sanluri", flag: "🇮🇹" }, { name: "Sardara", flag: "🇮🇹" }, { name: "Guspini", flag: "🇮🇹" }, { name: "Arbus", flag: "🇮🇹" }, { name: "Fluminimaggiore", flag: "🇮🇹" }, { name: "Buggerru", flag: "🇮🇹" }, { name: "Gonnesa", flag: "🇮🇹" }, { name: "Portoscuso", flag: "🇮🇹" }, { name: "Carbonia", flag: "🇮🇹" },

    // Europa Occidentale
    { name: "Parigi", flag: "🇫🇷" }, { name: "Londra", flag: "🇬🇧" }, { name: "Berlino", flag: "🇩🇪" }, { name: "Madrid", flag: "🇪🇸" }, { name: "Roma", flag: "🇮🇹" }, { name: "Vienna", flag: "🇦🇹" }, { name: "Amsterdam", flag: "🇳🇱" }, { name: "Bruxelles", flag: "🇧🇪" }, { name: "Lussemburgo", flag: "🇱🇺" }, { name: "Monaco", flag: "🇲🇨" },
    { name: "Andorra la Vella", flag: "🇦🇩" }, { name: "San Marino", flag: "🇸🇲" }, { name: "Città del Vaticano", flag: "🇻🇦" }, { name: "Lisbona", flag: "🇵🇹" }, { name: "Dublino", flag: "🇮🇪" }, { name: "Reykjavik", flag: "🇮🇸" }, { name: "Oslo", flag: "🇳🇴" }, { name: "Stoccolma", flag: "🇸🇪" }, { name: "Copenaghen", flag: "🇩🇰" }, { name: "Helsinki", flag: "🇫🇮" },
    
    // Francia 🇫🇷
    { name: "Marsiglia", flag: "🇫🇷" }, { name: "Lione", flag: "🇫🇷" }, { name: "Tolosa", flag: "🇫🇷" }, { name: "Nizza", flag: "🇫🇷" }, { name: "Nantes", flag: "🇫🇷" }, { name: "Strasburgo", flag: "🇫🇷" }, { name: "Montpellier", flag: "🇫🇷" }, { name: "Bordeaux", flag: "🇫🇷" }, { name: "Lilla", flag: "🇫🇷" }, { name: "Rennes", flag: "🇫🇷" },
    { name: "Grenoble", flag: "🇫🇷" }, { name: "Tolone", flag: "🇫🇷" }, { name: "Gent", flag: "🇫🇷" }, { name: "Dijon", flag: "🇫🇷" }, { name: "Angers", flag: "🇫🇷" }, { name: "Nimes", flag: "🇫🇷" }, { name: "Villeurbanne", flag: "🇫🇷" }, { name: "Saint-Denis", flag: "🇫🇷" }, { name: "Le Mans", flag: "🇫🇷" }, { name: "Aix-en-Provence", flag: "🇫🇷" },
    
    // Regno Unito 🇬🇧
    { name: "Manchester", flag: "🇬🇧" }, { name: "Birmingham", flag: "🇬🇧" }, { name: "Liverpool", flag: "🇬🇧" }, { name: "Leeds", flag: "🇬🇧" }, { name: "Glasgow", flag: "🇬🇧" }, { name: "Edimburgo", flag: "🇬🇧" }, { name: "Bristol", flag: "🇬🇧" }, { name: "Sheffield", flag: "🇬🇧" }, { name: "Cardiff", flag: "🇬🇧" }, { name: "Leicester", flag: "🇬🇧" },
    { name: "Coventry", flag: "🇬🇧" }, { name: "Bradford", flag: "🇬🇧" }, { name: "Belfast", flag: "🇬🇧" }, { name: "Nottingham", flag: "🇬🇧" }, { name: "Kingston upon Hull", flag: "🇬🇧" }, { name: "Plymouth", flag: "🇬🇧" }, { name: "Stoke-on-Trent", flag: "🇬🇧" }, { name: "Wolverhampton", flag: "🇬🇧" }, { name: "Derby", flag: "🇬🇧" }, { name: "Swansea", flag: "🇬🇧" },
    
    // Germania 🇩🇪
    { name: "Monaco di Baviera", flag: "🇩🇪" }, { name: "Francoforte", flag: "🇩🇪" }, { name: "Stoccarda", flag: "🇩🇪" }, { name: "Düsseldorf", flag: "🇩🇪" }, { name: "Colonia", flag: "🇩🇪" }, { name: "Amburgo", flag: "🇩🇪" }, { name: "Lipsia", flag: "🇩🇪" }, { name: "Dresda", flag: "🇩🇪" }, { name: "Norimberga", flag: "🇩🇪" }, { name: "Bremen", flag: "🇩🇪" },
    { name: "Hannover", flag: "🇩🇪" }, { name: "Bochum", flag: "🇩🇪" }, { name: "Wuppertal", flag: "🇩🇪" }, { name: "Bielefeld", flag: "🇩🇪" }, { name: "Mannheim", flag: "🇩🇪" }, { name: "Karlsruhe", flag: "🇩🇪" }, { name: "Augsburg", flag: "🇩🇪" }, { name: "Wiesbaden", flag: "🇩🇪" }, { name: "Münster", flag: "🇩🇪" }, { name: "Brunswick", flag: "🇩🇪" },
    { name: "Kiel", flag: "🇩🇪" }, { name: "Gelsenkirchen", flag: "🇩🇪" }, { name: "Chemnitz", flag: "🇩🇪" }, { name: "Aquisgrana", flag: "🇩🇪" }, { name: "Braunschweig", flag: "🇩🇪" }, { name: "Krefeld", flag: "🇩🇪" }, { name: "Halle", flag: "🇩🇪" }, { name: "Magdeburgo", flag: "🇩🇪" }, { name: "Freiburg", flag: "🇩🇪" }, { name: "Rostock", flag: "🇩🇪" },
    
    // Spagna 🇪🇸
    { name: "Barcellona", flag: "🇪🇸" }, { name: "Valencia", flag: "🇪🇸" }, { name: "Siviglia", flag: "🇪🇸" }, { name: "Malaga", flag: "🇪🇸" }, { name: "Bilbao", flag: "🇪🇸" }, { name: "Zaragoza", flag: "🇪🇸" }, { name: "Murcia", flag: "🇪🇸" }, { name: "Palma di Maiorca", flag: "🇪🇸" }, { name: "Las Palmas", flag: "🇪🇸" }, { name: "Santa Cruz de Tenerife", flag: "🇪🇸" },
    { name: "Valladolid", flag: "🇪🇸" }, { name: "Cordova", flag: "🇪🇸" }, { name: "Granada", flag: "🇪🇸" }, { name: "San Sebastian", flag: "🇪🇸" }, { name: "Alicante", flag: "🇪🇸" }, { name: "Gijon", flag: "🇪🇸" }, { name: "Vigo", flag: "🇪🇸" }, { name: "Vitoria", flag: "🇪🇸" }, { name: "A Coruña", flag: "🇪🇸" }, { name: "Pamplona", flag: "🇪🇸" },
    
    // Portogallo 🇵🇹
    { name: "Porto", flag: "🇵🇹" }, { name: "Braga", flag: "🇵🇹" }, { name: "Amadora", flag: "🇵🇹" }, { name: "Coimbra", flag: "🇵🇹" }, { name: "Setubal", flag: "🇵🇹" }, { name: "Funchal", flag: "🇵🇹" }, { name: "Vila Nova de Gaia", flag: "🇵🇹" }, { name: "Loures", flag: "🇵🇹" }, { name: "Evora", flag: "🇵🇹" }, { name: "Bragança", flag: "🇵🇹" },
    
    // Paesi Bassi 🇳🇱
    { name: "Rotterdam", flag: "🇳🇱" }, { name: "L'Aia", flag: "🇳🇱" }, { name: "Utrecht", flag: "🇳🇱" }, { name: "Eindhoven", flag: "🇳🇱" }, { name: "Tilburg", flag: "🇳🇱" }, { name: "Groninga", flag: "🇳🇱" }, { name: "Almere", flag: "🇳🇱" }, { name: "Breda", flag: "🇳🇱" }, { name: "Nimega", flag: "🇳🇱" }, { name: "Haarlem", flag: "🇳🇱" },
    
    // Belgio 🇧🇪
    { name: "Anversa", flag: "🇧🇪" }, { name: "Ghent", flag: "🇧🇪" }, { name: "Bruges", flag: "🇧🇪" }, { name: "Liegi", flag: "🇧🇪" }, { name: "Namur", flag: "🇧🇪" }, { name: "Leuven", flag: "🇧🇪" }, { name: "Mons", flag: "🇧🇪" }, { name: "Charleroi", flag: "🇧🇪" }, { name: "Hasselt", flag: "🇧🇪" }, { name: "Mechelen", flag: "🇧🇪" },
    
    // Svizzera 🇨🇭
    { name: "Ginevra", flag: "🇨🇭" }, { name: "Zurigo", flag: "🇨🇭" }, { name: "Basilea", flag: "🇨🇭" }, { name: "Berna", flag: "🇨🇭" }, { name: "Losanna", flag: "🇨🇭" }, { name: "Lugano", flag: "🇨🇭" }, { name: "San Gallo", flag: "🇨🇭" }, { name: "Lucerne", flag: "🇨🇭" }, { name: "Winterthur", flag: "🇨🇭" }, { name: "San Moritz", flag: "🇨🇭" },
    
    // Austria 🇦🇹
    { name: "Graz", flag: "🇦🇹" }, { name: "Linz", flag: "🇦🇹" }, { name: "Salisburgo", flag: "🇦🇹" }, { name: "Innsbruck", flag: "🇦🇹" }, { name: "Klagenfurt", flag: "🇦🇹" }, { name: "Villach", flag: "🇦🇹" }, { name: "Wels", flag: "🇦🇹" }, { name: "Sankt Pölten", flag: "🇦🇹" }, { name: "Dornbirn", flag: "🇦🇹" }, { name: "Wiener Neustadt", flag: "🇦🇹" },
    
    // Irlanda 🇮🇪
    { name: "Cork", flag: "🇮🇪" }, { name: "Galway", flag: "🇮🇪" }, { name: "Limerick", flag: "🇮🇪" }, { name: "Waterford", flag: "🇮🇪" }, { name: "Drogheda", flag: "🇮🇪" }, { name: "Dundalk", flag: "🇮🇪" }, { name: "Bray", flag: "🇮🇪" }, { name: "Navan", flag: "🇮🇪" }, { name: "Kilkenny", flag: "🇮🇪" }, { name: "Ennis", flag: "🇮🇪" },
    
    // Scandinavia
    { name: "Bergen", flag: "🇳🇴" }, { name: "Stavanger", flag: "🇳🇴" }, { name: "Trondheim", flag: "🇳🇴" }, { name: "Drammen", flag: "🇳🇴" }, { name: "Fredrikstad", flag: "🇳🇴" }, { name: "Kristiansand", flag: "🇳🇴" }, { name: "Sandnes", flag: "🇳🇴" }, { name: "Tromsø", flag: "🇳🇴" }, { name: "Sarpsborg", flag: "🇳🇴" }, { name: "Bodø", flag: "🇳🇴" },
    { name: "Gothenburg", flag: "🇸🇪" }, { name: "Malmö", flag: "🇸🇪" }, { name: "Uppsala", flag: "🇸🇪" }, { name: "Västerås", flag: "🇸🇪" }, { name: "Örebro", flag: "🇸🇪" }, { name: "Linköping", flag: "🇸🇪" }, { name: "Helsingborg", flag: "🇸🇪" }, { name: "Jönköping", flag: "🇸🇪" }, { name: "Norrköping", flag: "🇸🇪" }, { name: "Lund", flag: "🇸🇪" },
    { name: "Aarhus", flag: "🇩🇰" }, { name: "Odense", flag: "🇩🇰" }, { name: "Aalborg", flag: "🇩🇰" }, { name: "Esbjerg", flag: "🇩🇰" }, { name: "Randers", flag: "🇩🇰" }, { name: "Kolding", flag: "🇩🇰" }, { name: "Horsens", flag: "🇩🇰" }, { name: "Vejle", flag: "🇩🇰" }, { name: "Roskilde", flag: "🇩🇰" }, { name: "Herning", flag: "🇩🇰" },
    { name: "Espoo", flag: "🇫🇮" }, { name: "Tampere", flag: "🇫🇮" }, { name: "Vantaa", flag: "🇫🇮" }, { name: "Oulu", flag: "🇫🇮" }, { name: "Turku", flag: "🇫🇮" }, { name: "Jyväskylä", flag: "🇫🇮" }, { name: "Lahti", flag: "🇫🇮" }, { name: "Kuopio", flag: "🇫🇮" }, { name: "Pori", flag: "🇫🇮" }, { name: "Rovaniemi", flag: "🇫🇮" },
    { name: "Kópavogur", flag: "🇮🇸" }, { name: "Hafnarfjörður", flag: "🇮🇸" }, { name: "Akureyri", flag: "🇮🇸" }, { name: "Reykjanesbær", flag: "🇮🇸" }, { name: "Garðabær", flag: "🇮🇸" }, { name: "Mosfellsbær", flag: "🇮🇸" }, { name: "Selfoss", flag: "🇮🇸" }, { name: "Akranes", flag: "🇮🇸" }, { name: "Ísafjörður", flag: "🇮🇸" }, { name: "Seltjarnarnes", flag: "🇮🇸" },
    
    // Europa Orientale
    { name: "Varsavia", flag: "🇵🇱" }, { name: "Cracovia", flag: "🇵🇱" }, { name: "Łódź", flag: "🇵🇱" }, { name: "Wrocław", flag: "🇵🇱" }, { name: "Poznań", flag: "🇵🇱" }, { name: "Gdansk", flag: "🇵🇱" }, { name: "Szczecin", flag: "🇵🇱" }, { name: "Bydgoszcz", flag: "🇵🇱" }, { name: "Lublin", flag: "🇵🇱" }, { name: "Katowice", flag: "🇵🇱" },
    { name: "Praga", flag: "🇨🇿" }, { name: "Brno", flag: "🇨🇿" }, { name: "Ostrava", flag: "🇨🇿" }, { name: "Plzen", flag: "🇨🇿" }, { name: "Liberec", flag: "🇨🇿" }, { name: "Olomouc", flag: "🇨🇿" }, { name: "Budejovice", flag: "🇨🇿" }, { name: "Hradec Králové", flag: "🇨🇿" }, { name: "Usti nad Labem", flag: "🇨🇿" }, { name: "Pardubice", flag: "🇨🇿" },
    { name: "Bratislava", flag: "🇸🇰" }, { name: "Košice", flag: "🇸🇰" }, { name: "Prešov", flag: "🇸🇰" }, { name: "Nitra", flag: "🇸🇰" }, { name: "Žilina", flag: "🇸🇰" }, { name: "Banská Bystrica", flag: "🇸🇰" }, { name: "Trnava", flag: "🇸🇰" }, { name: "Martin", flag: "🇸🇰" }, { name: "Trenčín", flag: "🇸🇰" }, { name: "Poprad", flag: "🇸🇰" },
    { name: "Budapest", flag: "🇭🇺" }, { name: "Debrecen", flag: "🇭🇺" }, { name: "Szeged", flag: "🇭🇺" }, { name: "Miskolc", flag: "🇭🇺" }, { name: "Pécs", flag: "🇭🇺" }, { name: "Győr", flag: "🇭🇺" }, { name: "Nyíregyháza", flag: "🇭🇺" }, { name: "Kecskemét", flag: "🇭🇺" }, { name: "Székesfehérvár", flag: "🇭🇺" }, { name: "Szombathely", flag: "🇭🇺" },
    { name: "Lubiana", flag: "🇸🇮" }, { name: "Maribor", flag: "🇸🇮" }, { name: "Celje", flag: "🇸🇮" }, { name: "Kranj", flag: "🇸🇮" }, { name: "Velenje", flag: "🇸🇮" }, { name: "Novo Mesto", flag: "🇸🇮" }, { name: "Ptuj", flag: "🇸🇮" }, { name: "Trbovlje", flag: "🇸🇮" }, { name: "Kamnik", flag: "🇸🇮" }, { name: "Jesenice", flag: "🇸🇮" },
    { name: "Zagabria", flag: "🇭🇷" }, { name: "Spalato", flag: "🇭🇷" }, { name: "Rijeka", flag: "🇭🇷" }, { name: "Osijek", flag: "🇭🇷" }, { name: "Zara", flag: "🇭🇷" }, { name: "Pula", flag: "🇭🇷" }, { name: "Slavonski Brod", flag: "🇭🇷" }, { name: "Karlovac", flag: "🇭🇷" }, { name: "Varaždin", flag: "🇭🇷" }, { name: "Šibenik", flag: "🇭🇷" },
    { name: "Belgrado", flag: "🇷🇸" }, { name: "Niš", flag: "🇷🇸" }, { name: "Novi Sad", flag: "🇷🇸" }, { name: "Kragujevac", flag: "🇷🇸" }, { name: "Leskovac", flag: "🇷🇸" }, { name: "Subotica", flag: "🇷🇸" }, { name: "Kruševac", flag: "🇷🇸" }, { name: "Zrenjanin", flag: "🇷🇸" }, { name: "Pančevo", flag: "🇷🇸" }, { name: "Čačak", flag: "🇷🇸" },
    { name: "Sarajevo", flag: "🇧🇦" }, { name: "Banja Luka", flag: "🇧🇦" }, { name: "Tuzla", flag: "🇧🇦" }, { name: "Zenica", flag: "🇧🇦" }, { name: "Mostar", flag: "🇧🇦" }, { name: "Prijedor", flag: "🇧🇦" }, { name: "Bihać", flag: "🇧🇦" }, { name: "Bugojno", flag: "🇧🇦" }, { name: "Ilidža", flag: "🇧🇦" }, { name: "Cazin", flag: "🇧🇦" },
    { name: "Podgorica", flag: "🇲🇪" }, { name: "Nikšić", flag: "🇲🇪" }, { name: "Pljevlja", flag: "🇲🇪" }, { name: "Bijelo Polje", flag: "🇲🇪" }, { name: "Bar", flag: "🇲🇪" }, { name: "Herceg Novi", flag: "🇲🇪" }, { name: "Cetinje", flag: "🇲🇪" }, { name: "Budva", flag: "🇲🇪" }, { name: "Ulcinj", flag: "🇲🇪" }, { name: "Tivat", flag: "🇲🇪" },
    { name: "Skopje", flag: "🇲🇰" }, { name: "Bitola", flag: "🇲🇰" }, { name: "Kumanovo", flag: "🇲🇰" }, { name: "Prilep", flag: "🇲🇰" }, { name: "Tetovo", flag: "🇲🇰" }, { name: "Veles", flag: "🇲🇰" }, { name: "Štip", flag: "🇲🇰" }, { name: "Ohrid", flag: "🇲🇰" }, { name: "Gostivar", flag: "🇲🇰" }, { name: "Strumica", flag: "🇲🇰" },
    { name: "Tirana", flag: "🇦🇱" }, { name: "Durazzo", flag: "🇦🇱" }, { name: "Vlorë", flag: "🇦🇱" }, { name: "Elbasan", flag: "🇦🇱" }, { name: "Shkodër", flag: "🇦🇱" }, { name: "Fier", flag: "🇦🇱" }, { name: "Korçë", flag: "🇦🇱" }, { name: "Berat", flag: "🇦🇱" }, { name: "Lushnjë", flag: "🇦🇱" }, { name: "Pogradec", flag: "🇦🇱" },
    { name: "Atene", flag: "🇬🇷" }, { name: "Salonicco", flag: "🇬🇷" }, { name: "Patrasso", flag: "🇬🇷" }, { name: "Pireo", flag: "🇬🇷" }, { name: "Larissa", flag: "🇬🇷" }, { name: "Iraklion", flag: "🇬🇷" }, { name: "Volos", flag: "🇬🇷" }, { name: "Ioannina", flag: "🇬🇷" }, { name: "Chania", flag: "🇬🇷" }, { name: "Retimo", flag: "🇬🇷" },
    { name: "Nicosia", flag: "🇨🇾" }, { name: "Limassol", flag: "🇨🇾" }, { name: "Larnaca", flag: "🇨🇾" }, { name: "Paphos", flag: "🇨🇾" }, { name: "Famagosta", flag: "🇨🇾" }, { name: "Kyrenia", flag: "🇨🇾" },
    { name: "Valletta", flag: "🇲🇹" }, { name: "Birkirkara", flag: "🇲🇹" }, { name: "Mosta", flag: "🇲🇹" }, { name: "Qormi", flag: "🇲🇹" }, { name: "Żabbar", flag: "🇲🇹" }, { name: "San Pawl il-Baħar", flag: "🇲🇹" }, { name: "Sliema", flag: "🇲🇹" }, { name: "Żejtun", flag: "🇲🇹" }, { name: "Mdina", flag: "🇲🇹" },
    
    // Baltico
    { name: "Tallinn", flag: "🇪🇪" }, { name: "Tartu", flag: "🇪🇪" }, { name: "Narva", flag: "🇪🇪" }, { name: "Kohtla-Järve", flag: "🇪🇪" }, { name: "Pärnu", flag: "🇪🇪" }, { name: "Viljandi", flag: "🇪🇪" }, { name: "Rakvere", flag: "🇪🇪" }, { name: "Sillamäe", flag: "🇪🇪" }, { name: "Maardu", flag: "🇪🇪" }, { name: "Kuressaare", flag: "🇪🇪" },
    { name: "Riga", flag: "🇱🇻" }, { name: "Daugavpils", flag: "🇱🇻" }, { name: "Liepāja", flag: "🇱🇻" }, { name: "Jelgava", flag: "🇱🇻" }, { name: "Jūrmala", flag: "🇱🇻" }, { name: "Ventspils", flag: "🇱🇻" }, { name: "Rēzekne", flag: "🇱🇻" }, { name: "Ogre", flag: "🇱🇻" }, { name: "Valmiera", flag: "🇱🇻" }, { name: "Jēkabpils", flag: "🇱🇻" },
    { name: "Vilnius", flag: "🇱🇹" }, { name: "Kaunas", flag: "🇱🇹" }, { name: "Klaipėda", flag: "🇱🇹" }, { name: "Šiauliai", flag: "🇱🇹" }, { name: "Panevėžys", flag: "🇱🇹" }, { name: "Alytus", flag: "🇱🇹" }, { name: "Marijampolė", flag: "🇱🇹" }, { name: "Mažeikiai", flag: "🇱🇹" }, { name: "Jonava", flag: "🇱🇹" }, { name: "Utena", flag: "🇱🇹" },
    
    // Europa Orientale e Russia
    { name: "Mosca", flag: "🇷🇺" }, { name: "San Pietroburgo", flag: "🇷🇺" }, { name: "Novosibirsk", flag: "🇷🇺" }, { name: "Ekaterinburg", flag: "🇷🇺" }, { name: "Kazan", flag: "🇷🇺" }, { name: "Nizhny Novgorod", flag: "🇷🇺" }, { name: "Chelyabinsk", flag: "🇷🇺" }, { name: "Omsk", flag: "🇷🇺" }, { name: "Samara", flag: "🇷🇺" }, { name: "Rostov sul Don", flag: "🇷🇺" },
    { name: "Ufa", flag: "🇷🇺" }, { name: "Krasnojarsk", flag: "🇷🇺" }, { name: "Voronež", flag: "🇷🇺" }, { name: "Perm", flag: "🇷🇺" }, { name: "Volgograd", flag: "🇷🇺" }, { name: "Krasnodar", flag: "🇷🇺" }, { name: "Saratov", flag: "🇷🇺" }, { name: "Tjumen", flag: "🇷🇺" }, { name: "Togliatti", flag: "🇷🇺" }, { name: "Izhevsk", flag: "🇷🇺" },

    // Africa 🇦🇫
    // Nord Africa
    { name: "Il Cairo", flag: "🇪🇬" }, { name: "Alessandria", flag: "🇪🇬" }, { name: "Giza", flag: "🇪🇬" }, { name: "Shubra El-Kheima", flag: "🇪🇬" }, { name: "Port Said", flag: "🇪🇬" }, { name: "Suez", flag: "🇪🇬" }, { name: "Luxor", flag: "🇪🇬" }, { name: "Aswan", flag: "🇪🇬" }, { name: "Hurghada", flag: "🇪🇬" }, { name: "Sharm El-Sheikh", flag: "🇪🇬" },
    { name: "Casablanca", flag: "🇲🇦" }, { name: "Rabat", flag: "🇲🇦" }, { name: "Fes", flag: "🇲🇦" }, { name: "Tangeri", flag: "🇲🇦" }, { name: "Marrakech", flag: "🇲🇦" }, { name: "Agadir", flag: "🇲🇦" }, { name: "Essaouira", flag: "🇲🇦" }, { name: "Oujda", flag: "🇲🇦" }, { name: "Kenitra", flag: "🇲🇦" }, { name: "Tetouan", flag: "🇲🇦" },
    { name: "Algeri", flag: "🇩🇿" }, { name: "Orano", flag: "🇩🇿" }, { name: "Constantine", flag: "🇩🇿" }, { name: "Annaba", flag: "🇩🇿" }, { name: "Blida", flag: "🇩🇿" }, { name: "Batna", flag: "🇩🇿" }, { name: "Djelfa", flag: "🇩🇿" }, { name: "Setif", flag: "🇩🇿" }, { name: "Tlemcen", flag: "🇩🇿" }, { name: "Bejaia", flag: "🇩🇿" },
    { name: "Tunisi", flag: "🇹🇳" }, { name: "Sfax", flag: "🇹🇳" }, { name: "Sousse", flag: "🇹🇳" }, { name: "Kairouan", flag: "🇹🇳" }, { name: "Gabes", flag: "🇹🇳" }, { name: "Bizerte", flag: "🇹🇳" }, { name: "Ariana", flag: "🇹🇳" }, { name: "Gafsa", flag: "🇹🇳" }, { name: "Monastir", flag: "🇹🇳" }, { name: "Ben Arous", flag: "🇹🇳" },
    { name: "Tripoli", flag: "🇱🇾" }, { name: "Benghazi", flag: "🇱🇾" }, { name: "Misurata", flag: "🇱🇾" }, { name: "Tarhuna", flag: "🇱🇾" }, { name: "Al Khums", flag: "🇱🇾" }, { name: "Zawiya", flag: "🇱🇾" }, { name: "Ajdabiya", flag: "🇱🇾" }, { name: "Sirte", flag: "🇱🇾" }, { name: "Sabha", flag: "🇱🇾" }, { name: "Tobruk", flag: "🇱🇾" },
    
    // Africa Occidentale
    { name: "Lagos", flag: "🇳🇬" }, { name: "Abuja", flag: "🇳🇬" }, { name: "Kano", flag: "🇳🇬" }, { name: "Ibadan", flag: "🇳🇬" }, { name: "Kaduna", flag: "🇳🇬" }, { name: "Port Harcourt", flag: "🇳🇬" }, { name: "Benin City", flag: "🇳🇬" }, { name: "Maiduguri", flag: "🇳🇬" }, { name: "Zaria", flag: "🇳🇬" }, { name: "Aba", flag: "🇳🇬" },
    { name: "Accra", flag: "🇬🇭" }, { name: "Kumasi", flag: "🇬🇭" }, { name: "Tamale", flag: "🇬🇭" }, { name: "Sekondi-Takoradi", flag: "🇬🇭" }, { name: "Ashaiman", flag: "🇬🇭" }, { name: "Sunyani", flag: "🇬🇭" }, { name: "Cape Coast", flag: "🇬🇭" }, { name: "Obuasi", flag: "🇬🇭" }, { name: "Teshie", flag: "🇬🇭" }, { name: "Tema", flag: "🇬🇭" },
    { name: "Dakar", flag: "🇸🇳" }, { name: "Touba", flag: "🇸🇳" }, { name: "Thiès", flag: "🇸🇳" }, { name: "Rufisque", flag: "🇸🇳" }, { name: "Kaolack", flag: "🇸🇳" }, { name: "Mbour", flag: "🇸🇳" }, { name: "Ziguinchor", flag: "🇸🇳" }, { name: "Diourbel", flag: "🇸🇳" }, { name: "Saint-Louis", flag: "🇸🇳" }, { name: "Louga", flag: "🇸🇳" },
    { name: "Abidjan", flag: "🇨🇮" }, { name: "Yamoussoukro", flag: "🇨🇮" }, { name: "Bouaké", flag: "🇨🇮" }, { name: "Daloa", flag: "🇨🇮" }, { name: "San-Pédro", flag: "🇨🇮" }, { name: "Korhogo", flag: "🇨🇮" }, { name: "Man", flag: "🇨🇮" }, { name: "Gagnoa", flag: "🇨🇮" }, { name: "Dimbokro", flag: "🇨🇮" }, { name: "Agboville", flag: "🇨🇮" },
    { name: "Bamako", flag: "🇲🇱" }, { name: "Sikasso", flag: "🇲🇱" }, { name: "Koutiala", flag: "🇲🇱" }, { name: "Ségou", flag: "🇲🇱" }, { name: "Kayes", flag: "🇲🇱" }, { name: "Mopti", flag: "🇲🇱" }, { name: "Nioro du Sahel", flag: "🇲🇱" }, { name: "Gao", flag: "🇲🇱" }, { name: "Kati", flag: "🇲🇱" }, { name: "Kidal", flag: "🇲🇱" },
    
    // Africa Orientale
    { name: "Addis Abeba", flag: "🇪🇹" }, { name: "Dire Dawa", flag: "🇪🇹" }, { name: "Mekelle", flag: "🇪🇹" }, { name: "Gondar", flag: "🇪🇹" }, { name: "Bahir Dar", flag: "🇪🇹" }, { name: "Awasa", flag: "🇪🇹" }, { name: "Adama", flag: "🇪🇹" }, { name: "Hawassa", flag: "🇪🇹" }, { name: "Jimma", flag: "🇪🇹" }, { name: "Dessie", flag: "🇪🇹" },
    { name: "Nairobi", flag: "🇰🇪" }, { name: "Mombasa", flag: "🇰🇪" }, { name: "Kisumu", flag: "🇰🇪" }, { name: "Nakuru", flag: "🇰🇪" }, { name: "Eldoret", flag: "🇰🇪" }, { name: "Malindi", flag: "🇰🇪" }, { name: "Kitale", flag: "🇰🇪" }, { name: "Garissa", flag: "🇰🇪" }, { name: "Kakamega", flag: "🇰🇪" }, { name: "Nyeri", flag: "🇰🇪" },
    { name: "Dodoma", flag: "🇹🇿" }, { name: "Dar es Salaam", flag: "🇹🇿" }, { name: "Mwanza", flag: "🇹🇿" }, { name: "Arusha", flag: "🇹🇿" }, { name: "Mbeya", flag: "🇹🇿" }, { name: "Morogoro", flag: "🇹🇿" }, { name: "Tanga", flag: "🇹🇿" }, { name: "Kahama", flag: "🇹🇿" }, { name: "Tabora", flag: "🇹🇿" }, { name: "Zanzibar", flag: "🇹🇿" },
    { name: "Kampala", flag: "🇺🇬" }, { name: "Gulu", flag: "🇺🇬" }, { name: "Lira", flag: "🇺🇬" }, { name: "Mbarara", flag: "🇺🇬" }, { name: "Jinja", flag: "🇺🇬" }, { name: "Bwizibwera", flag: "🇺🇬" }, { name: "Mbale", flag: "🇺🇬" }, { name: "Masaka", flag: "🇺🇬" }, { name: "Entebbe", flag: "🇺🇬" }, { name: "Soroti", flag: "🇺🇬" },
    
    // Africa Australe
    { name: "Johannesburg", flag: "🇿🇦" }, { name: "Città del Capo", flag: "🇿🇦" }, { name: "Pretoria", flag: "🇿🇦" }, { name: "Durban", flag: "🇿🇦" }, { name: "Port Elizabeth", flag: "🇿🇦" }, { name: "Soweto", flag: "🇿🇦" }, { name: "Pietermaritzburg", flag: "🇿🇦" }, { name: "Benoni", flag: "🇿🇦" }, { name: "Tembisa", flag: "🇿🇦" }, { name: "East London", flag: "🇿🇦" },
    { name: "Harare", flag: "🇿🇼" }, { name: "Bulawayo", flag: "🇿🇼" }, { name: "Chitungwiza", flag: "🇿🇼" }, { name: "Mutare", flag: "🇿🇼" }, { name: "Gweru", flag: "🇿🇼" }, { name: "Kwekwe", flag: "🇿🇼" }, { name: "Kadoma", flag: "🇿🇼" }, { name: "Masvingo", flag: "🇿🇼" }, { name: "Chinhoyi", flag: "🇿🇼" }, { name: "Norton", flag: "🇿🇼" },
    { name: "Lusaka", flag: "🇿🇲" }, { name: "Ndola", flag: "🇿🇲" }, { name: "Kitwe", flag: "🇿🇲" }, { name: "Kabwe", flag: "🇿🇲" }, { name: "Chingola", flag: "🇿🇲" }, { name: "Mufulira", flag: "🇿🇲" }, { name: "Livingstone", flag: "🇿🇲" }, { name: "Luanshya", flag: "🇿🇲" }, { name: "Kasama", flag: "🇿🇲" }, { name: "Chipata", flag: "🇿🇲" },
    
    // Africa Centrale
    { name: "Kinshasa", flag: "🇨🇩" }, { name: "Lubumbashi", flag: "🇨🇩" }, { name: "Mbuji-Mayi", flag: "🇨🇩" }, { name: "Kisangani", flag: "🇨🇩" }, { name: "Kananga", flag: "🇨🇩" }, { name: "Likasi", flag: "🇨🇩" }, { name: "Kolwezi", flag: "🇨🇩" }, { name: "Tshikapa", flag: "🇨🇩" }, { name: "Bukavu", flag: "🇨🇩" }, { name: "Kikwit", flag: "🇨🇩" },
    { name: "Brazzaville", flag: "🇨🇬" }, { name: "Pointe-Noire", flag: "🇨🇬" }, { name: "Dolisie", flag: "🇨🇬" }, { name: "Nkayi", flag: "🇨🇬" }, { name: "Owando", flag: "🇨🇬" }, { name: "Ouésso", flag: "🇨🇬" }, { name: "Sibiti", flag: "🇨🇬" }, { name: "Impfondo", flag: "🇨🇬" }, { name: "Gamboma", flag: "🇨🇬" }, { name: "Kinkala", flag: "🇨🇬" },

    // Americas 🇺🇸
    // Stati Uniti d'America
    { name: "New York", flag: "🇺🇸" }, { name: "Los Angeles", flag: "🇺🇸" }, { name: "Chicago", flag: "🇺🇸" }, { name: "Houston", flag: "🇺🇸" }, { name: "Phoenix", flag: "🇺🇸" }, { name: "Philadelphia", flag: "🇺🇸" }, { name: "San Antonio", flag: "🇺🇸" }, { name: "San Diego", flag: "🇺🇸" }, { name: "Dallas", flag: "🇺🇸" }, { name: "San Jose", flag: "🇺🇸" },
    { name: "Austin", flag: "🇺🇸" }, { name: "Jacksonville", flag: "🇺🇸" }, { name: "Fort Worth", flag: "🇺🇸" }, { name: "Columbus", flag: "🇺🇸" }, { name: "Charlotte", flag: "🇺🇸" }, { name: "San Francisco", flag: "🇺🇸" }, { name: "Indianapolis", flag: "🇺🇸" }, { name: "Seattle", flag: "🇺🇸" }, { name: "Denver", flag: "🇺🇸" }, { name: "Washington", flag: "🇺🇸" },
    { name: "Boston", flag: "🇺🇸" }, { name: "El Paso", flag: "🇺🇸" }, { name: "Nashville", flag: "🇺🇸" }, { name: "Detroit", flag: "🇺🇸" }, { name: "Oklahoma City", flag: "🇺🇸" }, { name: "Portland", flag: "🇺🇸" }, { name: "Las Vegas", flag: "🇺🇸" }, { name: "Memphis", flag: "🇺🇸" }, { name: "Louisville", flag: "🇺🇸" }, { name: "Baltimore", flag: "🇺🇸" },
    { name: "Miami", flag: "🇺🇸" }, { name: "Tampa", flag: "🇺🇸" }, { name: "Orlando", flag: "🇺🇸" }, { name: "Atlanta", flag: "🇺🇸" }, { name: "New Orleans", flag: "🇺🇸" }, { name: "Honolulu", flag: "🇺🇸" }, { name: "Salt Lake City", flag: "🇺🇸" }, { name: "Minneapolis", flag: "🇺🇸" }, { name: "Cleveland", flag: "🇺🇸" }, { name: "Pittsburgh", flag: "🇺🇸" },
    
    // Canada
    { name: "Toronto", flag: "🇨🇦" }, { name: "Montreal", flag: "🇨🇦" }, { name: "Vancouver", flag: "🇨🇦" }, { name: "Calgary", flag: "🇨🇦" }, { name: "Edmonton", flag: "🇨🇦" }, { name: "Ottawa", flag: "🇨🇦" }, { name: "Winnipeg", flag: "🇨🇦" }, { name: "Quebec City", flag: "🇨🇦" }, { name: "Hamilton", flag: "🇨🇦" }, { name: "Kitchener", flag: "🇨🇦" },
    { name: "London", flag: "🇨🇦" }, { name: "Halifax", flag: "🇨🇦" }, { name: "St. Catharines", flag: "🇨🇦" }, { name: "Victoria", flag: "🇨🇦" }, { name: "Windsor", flag: "🇨🇦" }, { name: "Oshawa", flag: "🇨🇦" }, { name: "Saskatoon", flag: "🇨🇦" }, { name: "Regina", flag: "🇨🇦" }, { name: "Sherbrooke", flag: "🇨🇦" }, { name: "St. John's", flag: "🇨🇦" },
    
    // Messico
    { name: "Città del Messico", flag: "🇲🇽" }, { name: "Guadalajara", flag: "🇲🇽" }, { name: "Monterrey", flag: "🇲🇽" }, { name: "Puebla", flag: "🇲🇽" }, { name: "Tijuana", flag: "🇲🇽" }, { name: "León", flag: "🇲🇽" }, { name: "Ciudad Juárez", flag: "🇲🇽" }, { name: "Zapopan", flag: "🇲🇽" }, { name: "Nezahualcóyotl", flag: "🇲🇽" }, { name: "Cancún", flag: "🇲🇽" },
    { name: "Mexicali", flag: "🇲🇽" }, { name: "Hermosillo", flag: "🇲🇽" }, { name: "Chihuahua", flag: "🇲🇽" }, { name: "Mérida", flag: "🇲🇽" }, { name: "San Luis Potosí", flag: "🇲🇽" }, { name: "Aguascalientes", flag: "🇲🇽" }, { name: "Saltillo", flag: "🇲🇽" }, { name: "Culiacán", flag: "🇲🇽" }, { name: "Toluca", flag: "🇲🇽" }, { name: "Veracruz", flag: "🇲🇽" },
    
    // Brasile
    { name: "San Paolo", flag: "🇧🇷" }, { name: "Rio de Janeiro", flag: "🇧🇷" }, { name: "Brasilia", flag: "🇧🇷" }, { name: "Salvador", flag: "🇧🇷" }, { name: "Fortaleza", flag: "🇧🇷" }, { name: "Belo Horizonte", flag: "🇧🇷" }, { name: "Manaus", flag: "🇧🇷" }, { name: "Curitiba", flag: "🇧🇷" }, { name: "Recife", flag: "🇧🇷" }, { name: "Goiânia", flag: "🇧🇷" },
    { name: "Belém", flag: "🇧🇷" }, { name: "São Luís", flag: "🇧🇷" }, { name: "Maceió", flag: "🇧🇷" }, { name: "Teresina", flag: "🇧🇷" }, { name: "Natal", flag: "🇧🇷" }, { name: "Campo Grande", flag: "🇧🇷" }, { name: "João Pessoa", flag: "🇧🇷" }, { name: "Aracaju", flag: "🇧🇷" }, { name: "Cuiabá", flag: "🇧🇷" }, { name: "Florianópolis", flag: "🇧🇷" },
    { name: "Porto Alegre", flag: "🇧🇷" }, { name: "Vitória", flag: "🇧🇷" }, { name: "Boa Vista", flag: "🇧🇷" }, { name: "Macapá", flag: "🇧🇷" }, { name: "Porto Velho", flag: "🇧🇷" }, { name: "Rio Branco", flag: "🇧🇷" }, { name: "Palmas", flag: "🇧🇷" }, { name: "Alagoas", flag: "🇧🇷" }, { name: "Campinas", flag: "🇧🇷" }, { name: "São Bernardo do Campo", flag: "🇧🇷" },
    
    // Argentina
    { name: "Buenos Aires", flag: "🇦🇷" }, { name: "Córdoba", flag: "🇦🇷" }, { name: "Rosario", flag: "🇦🇷" }, { name: "Mendoza", flag: "🇦🇷" }, { name: "San Miguel de Tucumán", flag: "🇦🇷" }, { name: "La Plata", flag: "🇦🇷" }, { name: "Mar del Plata", flag: "🇦🇷" }, { name: "Salta", flag: "🇦🇷" }, { name: "Santa Fe", flag: "🇦🇷" }, { name: "San Juan", flag: "🇦🇷" },
    { name: "Resistencia", flag: "🇦🇷" }, { name: "Corrientes", flag: "🇦🇷" }, { name: "Posadas", flag: "🇦🇷" }, { name: "Neuquén", flag: "🇦🇷" }, { name: "Bahía Blanca", flag: "🇦🇷" }, { name: "Paraná", flag: "🇦🇷" }, { name: "Formosa", flag: "🇦🇷" }, { name: "San Luis", flag: "🇦🇷" }, { name: "Catamarca", flag: "🇦🇷" }, { name: "La Rioja", flag: "🇦🇷" },
    
    // Colombia
    { name: "Bogotá", flag: "🇨🇴" }, { name: "Medellín", flag: "🇨🇴" }, { name: "Cali", flag: "🇨🇴" }, { name: "Barranquilla", flag: "🇨🇴" }, { name: "Cartagena", flag: "🇨🇴" }, { name: "Cúcuta", flag: "🇨🇴" }, { name: "Bucaramanga", flag: "🇨🇴" }, { name: "Pereira", flag: "🇨🇴" }, { name: "Santa Marta", flag: "🇨🇴" }, { name: "Ibagué", flag: "🇨🇴" },
    { name: "Manizales", flag: "🇨🇴" }, { name: "Pasto", flag: "🇨🇴" }, { name: "Neiva", flag: "🇨🇴" }, { name: "Villavicencio", flag: "🇨🇴" }, { name: "Armenia", flag: "🇨🇴" }, { name: "Valledupar", flag: "🇨🇴" }, { name: "Montería", flag: "🇨🇴" }, { name: "Sincelejo", flag: "🇨🇴" }, { name: "Popayán", flag: "🇨🇴" }, { name: "Tunja", flag: "🇨🇴" },
    
    // Perù
    { name: "Lima", flag: "🇵🇪" }, { name: "Arequipa", flag: "🇵🇪" }, { name: "Trujillo", flag: "🇵🇪" }, { name: "Chiclayo", flag: "🇵🇪" }, { name: "Piura", flag: "🇵🇪" }, { name: "Iquitos", flag: "🇵🇪" }, { name: "Cusco", flag: "🇵🇪" }, { name: "Huancayo", flag: "🇵🇪" }, { name: "Chimbote", flag: "🇵🇪" }, { name: "Pucallpa", flag: "🇵🇪" },
    { name: "Tacna", flag: "🇵🇪" }, { name: "Ica", flag: "🇵🇪" }, { name: "Juliaca", flag: "🇵🇪" }, { name: "Sullana", flag: "🇵🇪" }, { name: "Ayacucho", flag: "🇵🇪" }, { name: "Huaraz", flag: "🇵🇪" }, { name: "Puno", flag: "🇵🇪" }, { name: "Tumbes", flag: "🇵🇪" }, { name: "Paita", flag: "🇵🇪" }, { name: "Moquegua", flag: "🇵🇪" },
    
    // Cile
    { name: "Santiago", flag: "🇨🇱" }, { name: "Valparaíso", flag: "🇨🇱" }, { name: "Concepción", flag: "🇨🇱" }, { name: "La Serena", flag: "🇨🇱" }, { name: "Antofagasta", flag: "🇨🇱" }, { name: "Temuco", flag: "🇨🇱" }, { name: "Iquique", flag: "🇨🇱" }, { name: "Puerto Montt", flag: "🇨🇱" }, { name: "Rancagua", flag: "🇨🇱" }, { name: "Talca", flag: "🇨🇱" },
    { name: "Arica", flag: "🇨🇱" }, { name: "Chillán", flag: "🇨🇱" }, { name: "Calama", flag: "🇨🇱" }, { name: "Osorno", flag: "🇨🇱" }, { name: "Copiapó", flag: "🇨🇱" }, { name: "Valdivia", flag: "🇨🇱" }, { name: "Quilpué", flag: "🇨🇱" }, { name: "Los Ángeles", flag: "🇨🇱" }, { name: "Punta Arenas", flag: "🇨🇱" }, { name: "San Bernardo", flag: "🇨🇱" },
    
    // Venezuela
    { name: "Caracas", flag: "🇻🇪" }, { name: "Maracaibo", flag: "🇻🇪" }, { name: "Valencia", flag: "🇻🇪" }, { name: "Barquisimeto", flag: "🇻🇪" }, { name: "Ciudad Guayana", flag: "🇻🇪" }, { name: "Maturín", flag: "🇻🇪" }, { name: "Maracay", flag: "🇻🇪" }, { name: "Petare", flag: "🇻🇪" }, { name: "Barcelona", flag: "🇻🇪" }, { name: "Puerto la Cruz", flag: "🇻🇪" },
    
    // Ecuador
    { name: "Quito", flag: "🇪🇨" }, { name: "Guayaquil", flag: "🇪🇨" }, { name: "Cuenca", flag: "🇪🇨" }, { name: "Santo Domingo", flag: "🇪🇨" }, { name: "Machala", flag: "🇪🇨" }, { name: "Durán", flag: "🇪🇨" }, { name: "Manta", flag: "🇪🇨" }, { name: "Portoviejo", flag: "🇪🇨" }, { name: "Ambato", flag: "🇪🇨" }, { name: "Riobamba", flag: "🇪🇨" },
    
    // Bolivia
    { name: "La Paz", flag: "🇧🇴" }, { name: "Santa Cruz de la Sierra", flag: "🇧🇴" }, { name: "Cochabamba", flag: "🇧🇴" }, { name: "Oruro", flag: "🇧🇴" }, { name: "Sucre", flag: "🇧🇴" }, { name: "Tarija", flag: "🇧🇴" }, { name: "Potosí", flag: "🇧🇴" }, { name: "Sacaba", flag: "🇧🇴" }, { name: "Montero", flag: "🇧🇴" }, { name: "Trinidad", flag: "🇧🇴" },
    
    // Uruguay
    { name: "Montevideo", flag: "🇺🇾" }, { name: "Salto", flag: "🇺🇾" }, { name: "Paysandú", flag: "🇺🇾" }, { name: "Las Piedras", flag: "🇺🇾" }, { name: "Rivera", flag: "🇺🇾" }, { name: "Maldonado", flag: "🇺🇾" }, { name: "Tacuarembó", flag: "🇺🇾" }, { name: "Melo", flag: "🇺🇾" }, { name: "Mercedes", flag: "🇺🇾" }, { name: "Artigas", flag: "🇺🇾" },
    
    // Paraguay
    { name: "Asunción", flag: "🇵🇾" }, { name: "Ciudad del Este", flag: "🇵🇾" }, { name: "San Lorenzo", flag: "🇵🇾" }, { name: "Luque", flag: "🇵🇾" }, { name: "Capiatá", flag: "🇵🇾" }, { name: "Lambaré", flag: "🇵🇾" }, { name: "Fernando de la Mora", flag: "🇵🇾" }, { name: "Limpio", flag: "🇵🇾" }, { name: "Ñemby", flag: "🇵🇾" }, { name: "Encarnación", flag: "🇵🇾" },
    
    // Centro America e Caraibi
    { name: "Guatemala City", flag: "🇬🇹" }, { name: "San Salvador", flag: "🇸🇻" }, { name: "Tegucigalpa", flag: "🇭🇳" }, { name: "Managua", flag: "🇳🇮" }, { name: "San José", flag: "🇨🇷" }, { name: "Panama City", flag: "🇵🇦" }, { name: "Havana", flag: "🇨🇺" }, { name: "Santiago de Cuba", flag: "🇨🇺" }, { name: "Camagüey", flag: "🇨🇺" }, { name: "Holguín", flag: "🇨🇺" },
    { name: "Santo Domingo", flag: "🇩🇴" }, { name: "Santiago de los Caballeros", flag: "🇩🇴" }, { name: "Santo Domingo Este", flag: "🇩🇴" }, { name: "San Pedro de Macorís", flag: "🇩🇴" }, { name: "La Romana", flag: "🇩🇴" }, { name: "San Cristóbal", flag: "🇩🇴" }, { name: "Puerto Plata", flag: "🇩🇴" }, { name: "San Francisco de Macorís", flag: "🇩🇴" }, { name: "Higüey", flag: "🇩🇴" }, { name: "Concepción de la Vega", flag: "🇩🇴" },
    { name: "Port-au-Prince", flag: "🇭🇹" }, { name: "Carrefour", flag: "🇭🇹" }, { name: "Delmas", flag: "🇭🇹" }, { name: "Pétion-Ville", flag: "🇭🇹" }, { name: "Port-de-Paix", flag: "🇭🇹" }, { name: "Les Cayes", flag: "🇭🇹" }, { name: "Gonaïves", flag: "🇭🇹" }, { name: "Saint-Marc", flag: "🇭🇹" }, { name: "Cap-Haïtien", flag: "🇭🇹" }, { name: "Jacmel", flag: "🇭🇹" },
    { name: "Kingston", flag: "🇯🇲" }, { name: "New Kingston", flag: "🇯🇲" }, { name: "Spanish Town", flag: "🇯🇲" }, { name: "Portmore", flag: "🇯🇲" }, { name: "Montego Bay", flag: "🇯🇲" }, { name: "Mandeville", flag: "🇯🇲" }, { name: "May Pen", flag: "🇯🇲" }, { name: "Old Harbour", flag: "🇯🇲" }, { name: "Linstead", flag: "🇯🇲" }, { name: "Half Way Tree", flag: "🇯🇲" },

    // Australia & Oceania 🇦🇺
    // Australia
    { name: "Sydney", flag: "🇦🇺" }, { name: "Melbourne", flag: "🇦🇺" }, { name: "Brisbane", flag: "🇦🇺" }, { name: "Perth", flag: "🇦🇺" }, { name: "Adelaide", flag: "🇦🇺" }, { name: "Gold Coast", flag: "🇦🇺" }, { name: "Newcastle", flag: "🇦🇺" }, { name: "Canberra", flag: "🇦🇺" }, { name: "Wollongong", flag: "🇦🇺" }, { name: "Geelong", flag: "🇦🇺" },
    { name: "Hobart", flag: "🇦🇺" }, { name: "Townsville", flag: "🇦🇺" }, { name: "Cairns", flag: "🇦🇺" }, { name: "Darwin", flag: "🇦🇺" }, { name: "Launceston", flag: "🇦🇺" }, { name: "Bendigo", flag: "🇦🇺" }, { name: "Ballarat", flag: "🇦🇺" }, { name: "Toowoomba", flag: "🇦🇺" }, { name: "Mackay", flag: "🇦🇺" }, { name: "Rockhampton", flag: "🇦🇺" },
    { name: "Bunbury", flag: "🇦🇺" }, { name: "Bundaberg", flag: "🇦🇺" }, { name: "Coffs Harbour", flag: "🇦🇺" }, { name: "Wagga Wagga", flag: "🇦🇺" }, { name: "Hervey Bay", flag: "🇦🇺" }, { name: "Albury", flag: "🇦🇺" }, { name: "Gladstone", flag: "🇦🇺" }, { name: "Mildura", flag: "🇦🇺" }, { name: "Shepparton", flag: "🇦🇺" }, { name: "Port Macquarie", flag: "🇦🇺" },
    
    // Nuova Zelanda
    { name: "Auckland", flag: "🇳🇿" }, { name: "Wellington", flag: "🇳🇿" }, { name: "Christchurch", flag: "🇳🇿" }, { name: "Hamilton", flag: "🇳🇿" }, { name: "Tauranga", flag: "🇳🇿" }, { name: "Napier-Hastings", flag: "🇳🇿" }, { name: "Dunedin", flag: "🇳🇿" }, { name: "Palmerston North", flag: "🇳🇿" }, { name: "Nelson", flag: "🇳🇿" }, { name: "Rotorua", flag: "🇳🇿" },
    { name: "New Plymouth", flag: "🇳🇿" }, { name: "Invercargill", flag: "🇳🇿" }, { name: "Whangarei", flag: "🇳🇿" }, { name: "Gisborne", flag: "🇳🇿" }, { name: "Napier", flag: "🇳🇿" }, { name: "Hastings", flag: "🇳🇿" }, { name: "Porirua", flag: "🇳🇿" }, { name: "Lower Hutt", flag: "🇳🇿" }, { name: "Upper Hutt", flag: "🇳🇿" }, { name: "Whanganui", flag: "🇳🇿" },
    
    // Isole del Pacifico
    { name: "Port Moresby", flag: "🇵🇬" }, { name: "Lae", flag: "🇵🇬" }, { name: "Arawa", flag: "🇵🇬" }, { name: "Mount Hagen", flag: "🇵🇬" }, { name: "Popondetta", flag: "🇵🇬" }, { name: "Madang", flag: "🇵🇬" }, { name: "Wewak", flag: "🇵🇬" }, { name: "Goroka", flag: "🇵🇬" }, { name: "Mendi", flag: "🇵🇬" }, { name: "Kimbe", flag: "🇵🇬" },
    { name: "Suva", flag: "🇫🇯" }, { name: "Nasinu", flag: "🇫🇯" }, { name: "Lautoka", flag: "🇫🇯" }, { name: "Nadi", flag: "🇫🇯" }, { name: "Labasa", flag: "🇫🇯" }, { name: "Ba", flag: "🇫🇯" }, { name: "Lami", flag: "🇫🇯" }, { name: "Sigatoka", flag: "🇫🇯" }, { name: "Levuka", flag: "🇫🇯" }, { name: "Savusavu", flag: "🇫🇯" },
    { name: "Honiara", flag: "🇸🇧" }, { name: "Auki", flag: "🇸🇧" }, { name: "Gizo", flag: "🇸🇧" }, { name: "Buala", flag: "🇸🇧" }, { name: "Tulagi", flag: "🇸🇧" }, { name: "Kirakira", flag: "🇸🇧" }, { name: "Lata", flag: "🇸🇧" }, { name: "Taro", flag: "🇸🇧" }, { name: "Munda", flag: "🇸🇧" }, { name: "Noro", flag: "🇸🇧" },
    { name: "Port-Vila", flag: "🇻🇺" }, { name: "Luganville", flag: "🇻🇺" }, { name: "Norsup", flag: "🇻🇺" }, { name: "Port-Olry", flag: "🇻🇺" }, { name: "Isangel", flag: "🇻🇺" }, { name: "Sola", flag: "🇻🇺" }, { name: "Lakatoro", flag: "🇻🇺" }, { name: "Saratamata", flag: "🇻🇺" }, { name: "Lonorore", flag: "🇻🇺" }, { name: "Lenakel", flag: "🇻🇺" },
    { name: "Apia", flag: "🇼🇸" }, { name: "Asau", flag: "🇼🇸" }, { name: "Salelologa", flag: "🇼🇸" }, { name: "Afega", flag: "🇼🇸" }, { name: "Leulumoega", flag: "🇼🇸" }, { name: "Safotu", flag: "🇼🇸" }, { name: "Satupaitea", flag: "🇼🇸" }, { name: "Mulifanua", flag: "🇼🇸" }, { name: "Faleula", flag: "🇼🇸" }, { name: "Vaiusu", flag: "🇼🇸" },
    { name: "Nukuʻalofa", flag: "🇹🇴" }, { name: "Neiafu", flag: "🇹🇴" }, { name: "Pangai", flag: "🇹🇴" }, { name: "Haveluloto", flag: "🇹🇴" }, { name: "Vaini", flag: "🇹🇴" }, { name: "Ohonua", flag: "🇹🇴" }, { name: "Hihifo", flag: "🇹🇴" }, { name: "Mua", flag: "🇹🇴" }, { name: "Alofi", flag: "🇳🇺" }, { name: "Hakupu", flag: "🇳🇺" },

    // Asia 🇨🇳
    // Cina
    { name: "Pechino", flag: "🇨🇳" }, { name: "Shanghai", flag: "🇨🇳" }, { name: "Guangzhou", flag: "🇨🇳" }, { name: "Shenzhen", flag: "🇨🇳" }, { name: "Tianjin", flag: "🇨🇳" }, { name: "Wuhan", flag: "🇨🇳" }, { name: "Dongguan", flag: "🇨🇳" }, { name: "Chengdu", flag: "🇨🇳" }, { name: "Foshan", flag: "🇨🇳" }, { name: "Hangzhou", flag: "🇨🇳" },
    { name: "Nanjing", flag: "🇨🇳" }, { name: "Shenyang", flag: "🇨🇳" }, { name: "Xi'an", flag: "🇨🇳" }, { name: "Harbin", flag: "🇨🇳" }, { name: "Suzhou", flag: "🇨🇳" }, { name: "Qingdao", flag: "🇨🇳" }, { name: "Dalian", flag: "🇨🇳" }, { name: "Zhengzhou", flag: "🇨🇳" }, { name: "Shijiazhuang", flag: "🇨🇳" }, { name: "Jinan", flag: "🇨🇳" },
    
    // Giappone
    { name: "Tokyo", flag: "🇯🇵" }, { name: "Yokohama", flag: "🇯🇵" }, { name: "Osaka", flag: "🇯🇵" }, { name: "Nagoya", flag: "🇯🇵" }, { name: "Sapporo", flag: "🇯🇵" }, { name: "Fukuoka", flag: "🇯🇵" }, { name: "Kobe", flag: "🇯🇵" }, { name: "Kyoto", flag: "🇯🇵" }, { name: "Kawasaki", flag: "🇯🇵" }, { name: "Hiroshima", flag: "🇯🇵" },
    { name: "Sendai", flag: "🇯🇵" }, { name: "Kitakyushu", flag: "🇯🇵" }, { name: "Chiba", flag: "🇯🇵" }, { name: "Sakai", flag: "🇯🇵" }, { name: "Niigata", flag: "🇯🇵" }, { name: "Hamamatsu", flag: "🇯🇵" }, { name: "Okayama", flag: "🇯🇵" }, { name: "Sagamihara", flag: "🇯🇵" }, { name: "Shizuoka", flag: "🇯🇵" }, { name: "Kumamoto", flag: "🇯🇵" },
    
    // India
    { name: "Nuova Delhi", flag: "🇮🇳" }, { name: "Mumbai", flag: "🇮🇳" }, { name: "Bangalore", flag: "🇮🇳" }, { name: "Hyderabad", flag: "🇮🇳" }, { name: "Ahmedabad", flag: "🇮🇳" }, { name: "Chennai", flag: "🇮🇳" }, { name: "Kolkata", flag: "🇮🇳" }, { name: "Surat", flag: "🇮🇳" }, { name: "Pune", flag: "🇮🇳" }, { name: "Jaipur", flag: "🇮🇳" },
    { name: "Lucknow", flag: "🇮🇳" }, { name: "Kanpur", flag: "🇮🇳" }, { name: "Nagpur", flag: "🇮🇳" }, { name: "Indore", flag: "🇮🇳" }, { name: "Thane", flag: "🇮🇳" }, { name: "Bhopal", flag: "🇮🇳" }, { name: "Visakhapatnam", flag: "🇮🇳" }, { name: "Pimpri-Chinchwad", flag: "🇮🇳" }, { name: "Patna", flag: "🇮🇳" }, { name: "Vadodara", flag: "🇮🇳" },
    
    // Corea del Sud
    { name: "Seoul", flag: "🇰🇷" }, { name: "Busan", flag: "🇰🇷" }, { name: "Incheon", flag: "🇰🇷" }, { name: "Daegu", flag: "🇰🇷" }, { name: "Daejeon", flag: "🇰🇷" }, { name: "Gwangju", flag: "🇰🇷" }, { name: "Ulsan", flag: "🇰🇷" }, { name: "Suwon", flag: "🇰🇷" }, { name: "Changwon", flag: "🇰🇷" }, { name: "Goyang", flag: "🇰🇷" },
    { name: "Yongin", flag: "🇰🇷" }, { name: "Seongnam", flag: "🇰🇷" }, { name: "Bucheon", flag: "🇰🇷" }, { name: "Ansan", flag: "🇰🇷" }, { name: "Cheongju", flag: "🇰🇷" }, { name: "Jeonju", flag: "🇰🇷" }, { name: "Anyang", flag: "🇰🇷" }, { name: "Cheonan", flag: "🇰🇷" }, { name: "Namyangju", flag: "🇰🇷" }, { name: "Pohang", flag: "🇰🇷" },
    
    // Tailandia
    { name: "Bangkok", flag: "🇹🇭" }, { name: "Nonthaburi", flag: "🇹🇭" }, { name: "Nakhon Ratchasima", flag: "🇹🇭" }, { name: "Chiang Mai", flag: "🇹🇭" }, { name: "Hat Yai", flag: "🇹🇭" }, { name: "Udon Thani", flag: "🇹🇭" }, { name: "Pak Kret", flag: "🇹🇭" }, { name: "Khon Kaen", flag: "🇹🇭" }, { name: "Nakhon Si Thammarat", flag: "🇹🇭" }, { name: "Laem Chabang", flag: "🇹🇭" },
    { name: "Surat Thani", flag: "🇹🇭" }, { name: "Rayong", flag: "🇹🇭" }, { name: "Chiang Rai", flag: "🇹🇭" }, { name: "Phuket", flag: "🇹🇭" }, { name: "Nakhon Sawan", flag: "🇹🇭" }, { name: "Samut Prakan", flag: "🇹🇭" }, { name: "Lampang", flag: "🇹🇭" }, { name: "Ubon Ratchathani", flag: "🇹🇭" }, { name: "Roi Et", flag: "🇹🇭" }, { name: "Pathum Thani", flag: "🇹🇭" },
    
    // Indonesia
    { name: "Giacarta", flag: "🇮🇩" }, { name: "Surabaya", flag: "🇮🇩" }, { name: "Bandung", flag: "🇮🇩" }, { name: "Bekasi", flag: "🇮🇩" }, { name: "Medan", flag: "🇮🇩" }, { name: "Tangerang", flag: "🇮🇩" }, { name: "Depok", flag: "🇮🇩" }, { name: "Semarang", flag: "🇮🇩" }, { name: "Palembang", flag: "🇮🇩" }, { name: "Makassar", flag: "🇮🇩" },
    { name: "South Tangerang", flag: "🇮🇩" }, { name: "Batam", flag: "🇮🇩" }, { name: "Bogor", flag: "🇮🇩" }, { name: "Pekanbaru", flag: "🇮🇩" }, { name: "Bandar Lampung", flag: "🇮🇩" }, { name: "Padang", flag: "🇮🇩" }, { name: "Malang", flag: "🇮🇩" }, { name: "Samarinda", flag: "🇮🇩" }, { name: "Tasikmalaya", flag: "🇮🇩" }, { name: "Serang", flag: "🇮🇩" },
    
    // Vietnam
    { name: "Ho Chi Minh City", flag: "🇻🇳" }, { name: "Hanoi", flag: "🇻🇳" }, { name: "Haiphong", flag: "🇻🇳" }, { name: "Da Nang", flag: "🇻🇳" }, { name: "Biên Hòa", flag: "🇻🇳" }, { name: "Huế", flag: "🇻🇳" }, { name: "Nha Trang", flag: "🇻🇳" }, { name: "Cần Thơ", flag: "🇻🇳" }, { name: "Rach Giá", flag: "🇻🇳" }, { name: "Qui Nhơn", flag: "🇻🇳" },
    { name: "Vũng Tàu", flag: "🇻🇳" }, { name: "Vinh", flag: "🇻🇳" }, { name: "Đà Lạt", flag: "🇻🇳" }, { name: "Nam Định", flag: "🇻🇳" }, { name: "Buôn Ma Thuột", flag: "🇻🇳" }, { name: "Long Xuyên", flag: "🇻🇳" }, { name: "Thái Nguyên", flag: "🇻🇳" }, { name: "Thanh Hóa", flag: "🇻🇳" }, { name: "Thủ Dầu Một", flag: "🇻🇳" }, { name: "Pleiku", flag: "🇻🇳" },
    
    // Malesia
    { name: "Kuala Lumpur", flag: "🇲🇾" }, { name: "George Town", flag: "🇲🇾" }, { name: "Ipoh", flag: "🇲🇾" }, { name: "Shah Alam", flag: "🇲🇾" }, { name: "Petaling Jaya", flag: "🇲🇾" }, { name: "Johor Bahru", flag: "🇲🇾" }, { name: "Subang Jaya", flag: "🇲🇾" }, { name: "Klang", flag: "🇲🇾" }, { name: "Kota Kinabalu", flag: "🇲🇾" }, { name: "Kuantan", flag: "🇲🇾" },
    { name: "Kuching", flag: "🇲🇾" }, { name: "Seremban", flag: "🇲🇾" }, { name: "Tawau", flag: "🇲🇾" }, { name: "Kota Bharu", flag: "🇲🇾" }, { name: "Selayang", flag: "🇲🇾" }, { name: "Sandakan", flag: "🇲🇾" }, { name: "Kajang", flag: "🇲🇾" }, { name: "Alor Setar", flag: "🇲🇾" }, { name: "Sungai Petani", flag: "🇲🇾" }, { name: "Kuala Terengganu", flag: "🇲🇾" },
    
    // Filippine
    { name: "Manila", flag: "🇵🇭" }, { name: "Quezon City", flag: "🇵🇭" }, { name: "Caloocan", flag: "🇵🇭" }, { name: "Davao City", flag: "🇵🇭" }, { name: "Cebu City", flag: "🇵🇭" }, { name: "Zamboanga City", flag: "🇵🇭" }, { name: "Taguig", flag: "🇵🇭" }, { name: "Antipolo", flag: "🇵🇭" }, { name: "Pasig", flag: "🇵🇭" }, { name: "Cagayan de Oro", flag: "🇵🇭" },
    { name: "Parañaque", flag: "🇵🇭" }, { name: "Valenzuela", flag: "🇵🇭" }, { name: "Dasmariñas", flag: "🇵🇭" }, { name: "General Santos", flag: "🇵🇭" }, { name: "Las Piñas", flag: "🇵🇭" }, { name: "Makati", flag: "🇵🇭" }, { name: "Bacolod", flag: "🇵🇭" }, { name: "Bacoor", flag: "🇵🇭" }, { name: "Muntinlupa", flag: "🇵🇭" }, { name: "San Jose del Monte", flag: "🇵🇭" },
    
    // Singapore
    { name: "Singapore", flag: "🇸🇬" },
    
    // Pakistan
    { name: "Karachi", flag: "🇵🇰" }, { name: "Lahore", flag: "🇵🇰" }, { name: "Faisalabad", flag: "🇵🇰" }, { name: "Rawalpindi", flag: "🇵🇰" }, { name: "Gujranwala", flag: "🇵🇰" }, { name: "Peshawar", flag: "🇵🇰" }, { name: "Multan", flag: "🇵🇰" }, { name: "Hyderabad", flag: "🇵🇰" }, { name: "Islamabad", flag: "🇵🇰" }, { name: "Quetta", flag: "🇵🇰" },
    
    // Bangladesh
    { name: "Dhaka", flag: "🇧🇩" }, { name: "Chittagong", flag: "🇧🇩" }, { name: "Khulna", flag: "🇧🇩" }, { name: "Rajshahi", flag: "🇧🇩" }, { name: "Sylhet", flag: "🇧🇩" }, { name: "Barisal", flag: "🇧🇩" }, { name: "Rangpur", flag: "🇧🇩" }, { name: "Comilla", flag: "🇧🇩" }, { name: "Narayanganj", flag: "🇧🇩" }, { name: "Gazipur", flag: "🇧🇩" },
    
    // Iran
    { name: "Teheran", flag: "🇮🇷" }, { name: "Mashhad", flag: "🇮🇷" }, { name: "Isfahan", flag: "🇮🇷" }, { name: "Karaj", flag: "🇮🇷" }, { name: "Shiraz", flag: "🇮🇷" }, { name: "Tabriz", flag: "🇮🇷" }, { name: "Qom", flag: "🇮🇷" }, { name: "Ahvaz", flag: "🇮🇷" }, { name: "Kermanshah", flag: "🇮🇷" }, { name: "Urmia", flag: "🇮🇷" },
    
    // Turchia
    { name: "Istanbul", flag: "🇹🇷" }, { name: "Ankara", flag: "🇹🇷" }, { name: "Izmir", flag: "🇹🇷" }, { name: "Bursa", flag: "🇹🇷" }, { name: "Adana", flag: "🇹🇷" }, { name: "Gaziantep", flag: "🇹🇷" }, { name: "Konya", flag: "🇹🇷" }, { name: "Antalya", flag: "🇹🇷" }, { name: "Kayseri", flag: "🇹🇷" }, { name: "Mersin", flag: "🇹🇷" },
    { name: "Eskişehir", flag: "🇹🇷" }, { name: "Diyarbakır", flag: "🇹🇷" }, { name: "Samsun", flag: "🇹🇷" }, { name: "Denizli", flag: "🇹🇷" }, { name: "Şanlıurfa", flag: "🇹🇷" }, { name: "Malatya", flag: "🇹🇷" }, { name: "Kahramanmaraş", flag: "🇹🇷" }, { name: "Erzurum", flag: "🇹🇷" }, { name: "Van", flag: "🇹🇷" }, { name: "Batman", flag: "🇹🇷" },
    
    // Arabia Saudita
    { name: "Riyadh", flag: "🇸🇦" }, { name: "Jeddah", flag: "🇸🇦" }, { name: "Mecca", flag: "🇸🇦" }, { name: "Medina", flag: "🇸🇦" }, { name: "Dammam", flag: "🇸🇦" }, { name: "Khobar", flag: "🇸🇦" }, { name: "Tabuk", flag: "🇸🇦" }, { name: "Buraidah", flag: "🇸🇦" }, { name: "Khamis Mushait", flag: "🇸🇦" }, { name: "Hail", flag: "🇸🇦" },
    
    // Emirati Arabi Uniti
    { name: "Dubai", flag: "🇦🇪" }, { name: "Abu Dhabi", flag: "🇦🇪" }, { name: "Sharjah", flag: "🇦🇪" }, { name: "Al Ain", flag: "🇦🇪" }, { name: "Ajman", flag: "🇦🇪" }, { name: "Ras Al Khaimah", flag: "🇦🇪" }, { name: "Fujairah", flag: "🇦🇪" }, { name: "Umm Al Quwain", flag: "🇦🇪" }, { name: "Khor Fakkan", flag: "🇦🇪" }, { name: "Dibba Al-Fujairah", flag: "🇦🇪" },
    
    // Israele
    { name: "Gerusalemme", flag: "🇮🇱" }, { name: "Tel Aviv", flag: "🇮🇱" }, { name: "Haifa", flag: "🇮🇱" }, { name: "Rishon LeZion", flag: "🇮🇱" }, { name: "Petah Tikva", flag: "🇮🇱" }, { name: "Ashdod", flag: "🇮🇱" }, { name: "Netanya", flag: "🇮🇱" }, { name: "Beersheba", flag: "🇮🇱" }, { name: "Holon", flag: "🇮🇱" }, { name: "Bnei Brak", flag: "🇮🇱" },
    
    // Kazakhstan
    { name: "Astana", flag: "🇰🇿" }, { name: "Almaty", flag: "🇰🇿" }, { name: "Shymkent", flag: "🇰🇿" }, { name: "Karaganda", flag: "🇰🇿" }, { name: "Aktobe", flag: "🇰🇿" }, { name: "Taraz", flag: "🇰🇿" }, { name: "Pavlodar", flag: "🇰🇿" }, { name: "Ust-Kamenogorsk", flag: "🇰🇿" }, { name: "Semey", flag: "🇰🇿" }, { name: "Oral", flag: "🇰🇿" },
    
    // Iraq
    { name: "Baghdad", flag: "🇮🇶" }, { name: "Basra", flag: "🇮🇶" }, { name: "Mosul", flag: "🇮🇶" }, { name: "Erbil", flag: "🇮🇶" }, { name: "Sulaymaniyah", flag: "🇮🇶" }, { name: "Najaf", flag: "🇮🇶" }, { name: "Karbala", flag: "🇮🇶" }, { name: "Nasiriyah", flag: "🇮🇶" }, { name: "Amara", flag: "🇮🇶" }, { name: "Kut", flag: "🇮🇶" },
    
    // Afghanistan
    { name: "Kabul", flag: "🇦🇫" }, { name: "Kandahar", flag: "🇦🇫" }, { name: "Herat", flag: "🇦🇫" }, { name: "Mazar-i-Sharif", flag: "🇦🇫" }, { name: "Kunduz", flag: "🇦🇫" }, { name: "Taloqan", flag: "🇦🇫" }, { name: "Jalalabad", flag: "🇦🇫" }, { name: "Puli Khumri", flag: "🇦🇫" }, { name: "Charikar", flag: "🇦🇫" }, { name: "Khost", flag: "🇦🇫" },
    
    // Siria
    { name: "Damascus", flag: "🇸🇾" }, { name: "Aleppo", flag: "🇸🇾" }, { name: "Homs", flag: "🇸🇾" }, { name: "Latakia", flag: "🇸🇾" }, { name: "Hama", flag: "🇸🇾" }, { name: "Raqqa", flag: "🇸🇾" }, { name: "Deir ez-Zor", flag: "🇸🇾" }, { name: "Al-Hasakah", flag: "🇸🇾" }, { name: "Qamishli", flag: "🇸🇾" }, { name: "Tartus", flag: "🇸🇾" },
    
    // Yemen
    { name: "Sana'a", flag: "🇾🇪" }, { name: "Aden", flag: "🇾🇪" }, { name: "Taiz", flag: "🇾🇪" }, { name: "Al Hudaydah", flag: "🇾🇪" }, { name: "Ibb", flag: "🇾🇪" }, { name: "Dhamar", flag: "🇾🇪" }, { name: "Mukalla", flag: "🇾🇪" }, { name: "Hajjah", flag: "🇾🇪" }, { name: "Amran", flag: "🇾🇪" }, { name: "Sa'dah", flag: "🇾🇪" },
    
    // Giordania
    { name: "Amman", flag: "🇯🇴" }, { name: "Irbid", flag: "🇯🇴" }, { name: "Russeifa", flag: "🇯🇴" }, { name: "Zarqa", flag: "🇯🇴" }, { name: "Aqaba", flag: "🇯🇴" }, { name: "Madaba", flag: "🇯🇴" }, { name: "Salt", flag: "🇯🇴" }, { name: "Karak", flag: "🇯🇴" }, { name: "Jerash", flag: "🇯🇴" }, { name: "Ma'an", flag: "🇯🇴" },
    
    // Libano
    { name: "Beirut", flag: "🇱🇧" }, { name: "Tripoli", flag: "🇱🇧" }, { name: "Sidon", flag: "🇱🇧" }, { name: "Tyre", flag: "🇱🇧" }, { name: "Nabatieh", flag: "🇱🇧" }, { name: "Zahle", flag: "🇱🇧" }, { name: "Aley", flag: "🇱🇧" }, { name: "Baalbek", flag: "🇱🇧" }, { name: "Jounieh", flag: "🇱🇧" }, { name: "Byblos", flag: "🇱🇧" },
    
    // Sri Lanka
    { name: "Colombo", flag: "🇱🇰" }, { name: "Dehiwala-Mount Lavinia", flag: "🇱🇰" }, { name: "Moratuwa", flag: "🇱🇰" }, { name: "Negombo", flag: "🇱🇰" }, { name: "Kandy", flag: "🇱🇰" }, { name: "Kalmunai", flag: "🇱🇰" }, { name: "Vavuniya", flag: "🇱🇰" }, { name: "Galle", flag: "🇱🇰" }, { name: "Trincomalee", flag: "🇱🇰" }, { name: "Batticaloa", flag: "🇱🇰" },
    
    // Myanmar
    { name: "Yangon", flag: "🇲🇲" }, { name: "Mandalay", flag: "🇲🇲" }, { name: "Naypyidaw", flag: "🇲🇲" }, { name: "Mawlamyine", flag: "🇲🇲" }, { name: "Bago", flag: "🇲🇲" }, { name: "Pathein", flag: "🇲🇲" }, { name: "Monywa", flag: "🇲🇲" }, { name: "Sittwe", flag: "🇲🇲" }, { name: "Meiktila", flag: "🇲🇲" }, { name: "Myeik", flag: "🇲🇲" },
    
    // Nepal
    { name: "Kathmandu", flag: "🇳🇵" }, { name: "Pokhara", flag: "🇳🇵" }, { name: "Lalitpur", flag: "🇳🇵" }, { name: "Bharatpur", flag: "🇳🇵" }, { name: "Biratnagar", flag: "🇳🇵" }, { name: "Birgunj", flag: "🇳🇵" }, { name: "Dharan", flag: "🇳🇵" }, { name: "Bhimdatta", flag: "🇳🇵" }, { name: "Butwal", flag: "🇳🇵" }, { name: "Hetauda", flag: "🇳🇵" },
    
    // Mongolia
    { name: "Ulaanbaatar", flag: "🇲🇳" }, { name: "Erdenet", flag: "🇲🇳" }, { name: "Darkhan", flag: "🇲🇳" }, { name: "Choibalsan", flag: "🇲🇳" }, { name: "Mörön", flag: "🇲🇳" }, { name: "Nalaikh", flag: "🇲🇳" }, { name: "Ölgii", flag: "🇲🇳" }, { name: "Bayankhongor", flag: "🇲🇳" }, { name: "Arvaikheer", flag: "🇲🇳" }, { name: "Ulaangom", flag: "🇲🇳" },
    
    // Uzbekistan
    { name: "Tashkent", flag: "🇺🇿" }, { name: "Namangan", flag: "🇺🇿" }, { name: "Samarkand", flag: "🇺🇿" }, { name: "Andijan", flag: "🇺🇿" }, { name: "Nukus", flag: "🇺🇿" }, { name: "Bukhara", flag: "🇺🇿" }, { name: "Qarshi", flag: "🇺🇿" }, { name: "Kokand", flag: "🇺🇿" }, { name: "Margilan", flag: "🇺🇿" }, { name: "Fergana", flag: "🇺🇿" },
    
    // Taiwan
    { name: "Taipei", flag: "🇹🇼" }, { name: "Kaohsiung", flag: "🇹🇼" }, { name: "Taichung", flag: "🇹🇼" }, { name: "Tainan", flag: "🇹🇼" }, { name: "Banqiao", flag: "🇹🇼" }, { name: "Hsinchu", flag: "🇹🇼" }, { name: "Taoyuan", flag: "🇹🇼" }, { name: "Keelung", flag: "🇹🇼" }, { name: "Chiayi", flag: "🇹🇼" }, { name: "Changhua", flag: "🇹🇼" },
    
    // Hong Kong
    { name: "Hong Kong", flag: "🇭🇰" }, { name: "Kowloon", flag: "🇭🇰" }, { name: "Tsuen Wan", flag: "🇭🇰" }, { name: "Sha Tin", flag: "🇭🇰" }, { name: "Tuen Mun", flag: "🇭🇰" }, { name: "Tai Po", flag: "🇭🇰" }, { name: "Yuen Long", flag: "🇭🇰" }, { name: "Kwun Tong", flag: "🇭🇰" }, { name: "Tseung Kwan O", flag: "🇭🇰" }, { name: "Kwai Chung", flag: "🇭🇰" },
    
    // Macau
    { name: "Macau", flag: "🇲🇴" }, { name: "Taipa", flag: "🇲🇴" }, { name: "Coloane", flag: "🇲🇴" }, { name: "Cotai", flag: "🇲🇴" }, { name: "Sé", flag: "🇲🇴" }, { name: "Nossa Senhora de Fátima", flag: "🇲🇴" }, { name: "São Lázaro", flag: "🇲🇴" }, { name: "Santo António", flag: "🇲🇴" }, { name: "São Lourenço", flag: "🇲🇴" }, { name: "Nossa Senhora do Carmo", flag: "🇲🇴" },
  ];

  // Autocomplete functions
  // Validation function to check for duplicates
  const validateDestination = (newDest: { name: string; flag: string }) => {
    const exists = DESTINATIONS_WITH_FLAGS.some(dest => 
      dest.name.toLowerCase() === newDest.name.toLowerCase()
    );
    if (exists) {
      console.warn(`Destination "${newDest.name}" already exists in the list`);
      return false;
    }
    return true;
  };

  const filterSuggestions = (input: string) => {
    if (!input) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = DESTINATIONS_WITH_FLAGS.filter(dest =>
      dest.name.toLowerCase().startsWith(input.toLowerCase())
    );
    
    // Remove duplicates by city name, keeping the first occurrence
    const uniqueDestinations = filtered.filter((dest, index, self) =>
      index === self.findIndex(d => d.name.toLowerCase() === dest.name.toLowerCase())
    );
    
    // Console logging for testing deduplication
    if (input.toLowerCase() === 'roma' || input.toLowerCase() === 'madrid' || input.toLowerCase() === 'paris') {
      console.log(`🔍 Search for "${input}":`);
      console.log(`  - Original matches: ${filtered.length}`);
      console.log(`  - After deduplication: ${uniqueDestinations.length}`);
      console.log(`  - Results:`, uniqueDestinations.map(d => `${d.flag} ${d.name}`));
    }
    
    setSuggestions(uniqueDestinations.slice(0, 5));
    setHighlightedIndex(-1);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: { name: string; flag: string }) => {
    setDestination(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSuggestionClick(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.autocomplete-container')) {
        setSuggestions([]);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const adjustPeople = (d: number) => {
    const v = Math.max(1, Math.min(8, (Number(people) || 1) + d));
    setPeople(v);
    setPulsePeople(true);
    window.setTimeout(() => setPulsePeople(false), 180);
  };

  const handleDatePickerOpenChange = (isOpen: boolean) => {
    onDatePickerToggle?.(isOpen);
  };
  
  const [pulsePeople, setPulsePeople] = useState(false);

  // Sync with datePickerState
  useEffect(() => {
    if (datePickerState) {
      setDays(datePickerState.days);
      setTravelDates({
        startDate: datePickerState.startDate,
        endDate: datePickerState.endDate,
        days: datePickerState.days
      });
    }
  }, [datePickerState]);
  
  const daysMinusRef = useRef<HTMLButtonElement | null>(null);
  const daysPlusRef = useRef<HTMLButtonElement | null>(null);
  const peopleMinusRef = useRef<HTMLButtonElement | null>(null);
  const peoplePlusRef = useRef<HTMLButtonElement | null>(null);
  

  useEffect(() => {
    const cmp = (a: HTMLElement | null, b: HTMLElement | null, label: string) => {
      if (!a || !b) return;
      const sa = getComputedStyle(a);
      const sb = getComputedStyle(b);
      const ca = sa.backgroundImage || sa.backgroundColor;
      const cb = sb.backgroundImage || sb.backgroundColor;
      if (ca !== cb) console.warn(`Color mismatch in ${label} +/-`, { ca, cb });
    };
    cmp(daysMinusRef.current, daysPlusRef.current, 'days');
    cmp(peopleMinusRef.current, peoplePlusRef.current, 'people');
  }, [days, people]);
  

  return (
    <section id="hero" className="HeroSection relative min-h-screen w-full bg-slate-950 text-white overflow-hidden flex items-center justify-center">
      <style>{`
        @media (max-width: 768px) {
          .HeroSection { position: relative; }
          .HeroSection::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url('/backgroundmobile.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            filter: blur(4px);
            transform: scale(1.02);
            z-index: 0;
          }
          .HeroSection picture { display: none; }
        }
      `}</style>
      <picture>
        <source srcSet="/background.png" type="image/png" />
        <img
          src="/background.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_35%] sm:object-center"
        />
      </picture>

      {/* Animated SVG elements */}
      <div className="hero-pattern absolute left-0 right-0 bottom-0 top-20 opacity-40 pointer-events-none hidden sm:block">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow-hero" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="shadow-hero">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
            <style>{`
              @keyframes float-plane-1 {
                0% { transform: translateX(-150px) translateY(-100px); }
                50% { transform: translateX(300px) translateY(-80px); }
                100% { transform: translateX(750px) translateY(-100px); }
              }
              @keyframes float-plane-2 {
                0% { transform: translateX(-100px) translateY(50px); }
                50% { transform: translateX(350px) translateY(30px); }
                100% { transform: translateX(800px) translateY(50px); }
              }
              @keyframes float-plane-3 {
                0% { transform: translateX(-80px) translateY(200px); }
                50% { transform: translateX(400px) translateY(180px); }
                100% { transform: translateX(850px) translateY(200px); }
              }
              @keyframes pulse-node {
                0%, 100% { r: 4; opacity: 0.4; }
                50% { r: 6; opacity: 1; }
              }
              @keyframes orbit-circle {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes circuit-pulse {
                0%, 100% { stroke-width: 1; opacity: 0.3; }
                50% { stroke-width: 1.5; opacity: 0.7; }
              }
              .plane-1 { animation: float-plane-1 14s infinite ease-in-out; }
              .plane-2 { animation: float-plane-2 16s infinite ease-in-out 2s; }
              .plane-3 { animation: float-plane-3 18s infinite ease-in-out 4s; }
              .pulse-node { animation: pulse-node 3s infinite; }
              .orbit { animation: orbit-circle 40s infinite linear; transform-origin: 600px 320px; }
              .circuit { animation: circuit-pulse 2s infinite; }
            `}</style>
            <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base gradient background */}
          <rect width="1200" height="800" fill="url(#glow-grad)" opacity="0.4" />

          {/* Grid pattern subtle */}
          <g opacity="0.08" stroke="#3b82f6" strokeWidth="0.5">
            {[...Array(16)].map((_, i) => (
              <line key={`grid-h-${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} />
            ))}
            {[...Array(24)].map((_, i) => (
              <line key={`grid-v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="800" />
            ))}
          </g>

          {/* Central globe with orbiting elements */}
          <g className="orbit">
            <circle cx="600" cy="320" r="120" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" />
            <circle cx="600" cy="320" r="100" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.2" />
            <circle cx="600" cy="320" r="80" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" />
          </g>

          {/* Core globe */}
          <circle cx="600" cy="320" r="60" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.3" filter="url(#glow-hero)" />
          <circle cx="600" cy="320" r="45" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4" filter="url(#glow-hero)" />
          <circle cx="600" cy="320" r="30" fill="none" stroke="#f97316" strokeWidth="0.8" opacity="0.5" filter="url(#glow-hero)" />

          {/* Central bright point */}
          <circle cx="600" cy="320" r="6" fill="#f97316" opacity="0.6" filter="url(#glow-hero)" />

          {/* Continents/map markers - pulsing nodes */}
          <circle className="pulse-node" cx="500" cy="250" r="4" fill="#f97316" filter="url(#glow-hero)" />
          <circle className="pulse-node" cx="720" cy="280" r="4" fill="#3b82f6" filter="url(#glow-hero)" style={{animationDelay: '0.5s'}} />
          <circle className="pulse-node" cx="480" cy="380" r="4" fill="#f97316" filter="url(#glow-hero)" style={{animationDelay: '1s'}} />
          <circle className="pulse-node" cx="750" cy="360" r="4" fill="#3b82f6" filter="url(#glow-hero)" style={{animationDelay: '1.5s'}} />

          {/* Flight routes - circuit lines */}
          <path className="circuit" d="M 500 250 Q 600 280 720 280" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.5" />
          <path className="circuit" d="M 720 280 Q 700 320 750 360" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.5" style={{animationDelay: '0.3s'}} />
          <path className="circuit" d="M 750 360 Q 650 380 480 380" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.5" style={{animationDelay: '0.6s'}} />
          <path className="circuit" d="M 480 380 Q 500 300 500 250" stroke="#3b82f6" strokeWidth="1.5" fill="none" opacity="0.5" style={{animationDelay: '0.9s'}} />

          {/* Circuit nodes on routes */}
          <circle cx="550" cy="265" r="3" fill="#f97316" opacity="0.7" filter="url(#glow-hero)" />
          <circle cx="710" cy="320" r="3" fill="#3b82f6" opacity="0.7" filter="url(#glow-hero)" />
          <circle cx="615" cy="370" r="3" fill="#f97316" opacity="0.7" filter="url(#glow-hero)" />
          <circle cx="490" cy="340" r="3" fill="#3b82f6" opacity="0.7" filter="url(#glow-hero)" />

          {/* AI circuits pattern - geometric elements */}
          <g opacity="0.25" stroke="#3b82f6" strokeWidth="0.8" fill="none">
            <rect x="150" y="100" width="80" height="80" rx="5" />
            <rect x="200" y="120" width="40" height="40" rx="2" />
            <line x1="150" y1="140" x2="230" y2="140" />
            <line x1="190" y1="100" x2="190" y2="180" />
          </g>

          <g opacity="0.25" stroke="#f97316" strokeWidth="0.8" fill="none">
            <rect x="970" y="650" width="80" height="80" rx="5" />
            <rect x="990" y="680" width="40" height="40" rx="2" />
            <line x1="970" y1="690" x2="1050" y2="690" />
            <line x1="1010" y1="650" x2="1010" y2="730" />
          </g>

          

          {/* Connecting lines between nodes - tech style */}
          <line x1="200" y1="150" x2="500" y2="250" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />
          <line x1="1000" y1="700" x2="720" y2="280" stroke="#f97316" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />
          <line x1="100" y1="700" x2="480" y2="380" stroke="#3b82f6" strokeWidth="0.5" opacity="0.2" strokeDasharray="5,5" />

          {/* Subtle data points */}
          <circle cx="150" cy="150" r="2" fill="#3b82f6" opacity="0.4" />
          <circle cx="1050" cy="750" r="2" fill="#f97316" opacity="0.4" />
          <circle cx="120" cy="720" r="2" fill="#3b82f6" opacity="0.4" />
          <circle cx="1100" cy="150" r="2" fill="#f97316" opacity="0.4" />
        </svg>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/30 to-slate-950/50"></div>

      <div className="relative z-10 mx-auto px-6 pt-24 pb-32 max-w-5xl text-center flex flex-col items-center gap-6">

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Pianifica.
          <br />
          <span className="text-transparent bg-gradient-to-r from-orange-500 via-blue-400 to-orange-500 bg-clip-text pulse-text">
            Esplora. Vivi.
          </span>
          <br />
          <span className="text-transparent bg-gradient-to-r from-brand-orange via-brand-blue to-brand-orangelight bg-clip-text filter drop-shadow-md md:drop-shadow-lg">
            <span className="lg:text-white lg:drop-shadow-lg">Il tuo viaggio completo, creato</span>{' '}
            <span className="lg:text-brand-blue lg:drop-shadow-lg">in pochi secondi</span>{' '}
            <span className="lg:text-brand-orange lg:drop-shadow-lg">con l’intelligenza artificiale.</span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          <span className="font-semibold">Inserisci una destinazione, le date e il numero di persone.</span>
          <span className="block mt-2">ItinerAI genera un itinerario <span className="text-transparent bg-gradient-to-r from-brand-blue/90 to-brand-teal/90 bg-clip-text font-medium filter drop-shadow-sm md:drop-shadow-lg md:from-white/95 md:to-white/95">giorno per giorno</span> con voli, hotel, attività e tanto altro con <span className="text-transparent bg-gradient-to-r from-brand-orange/90 to-brand-orangelight/90 bg-clip-text font-medium filter drop-shadow-sm md:drop-shadow-lg md:from-white/95 md:to-white/95">link pronti alla prenotazione</span>.</span>
        </p>

        <div className="mx-auto max-w-[45rem] w-full relative">
          <div className="w-full flex flex-col items-center gap-3 md:gap-4 bg-white/8 md:bg-white/5 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/20 md:hover:border-orange-500/50 shadow-md transition-all">
            <style>{`@media (prefers-reduced-motion: reduce){ .cursor-hero{ animation: none !important; opacity: 1 !important; } .pulse-text{ animation: none !important; } }`}</style>
            <style>{`
              .stepper-btn { color: #e5e7eb; background: rgba(255,255,255,.10); }
              .stepper-btn:hover { background: rgba(255,255,255,.20); }
              .stepper-btn:disabled { opacity: .5; cursor: not-allowed; }
              .stepper-days { background-image: linear-gradient(90deg,#FF8A3D 0%,#FFB070 100%); }
              .stepper-people { background-image: linear-gradient(90deg,#3B82F6 0%,#14B8A6 100%); }
              @keyframes pulseText { 0%,100%{ transform: scale(1); text-shadow: 0 0 0 rgba(255,255,255,0); } 50%{ transform: scale(1.01); text-shadow: 0 0 14px rgba(255,255,255,.18);} }
              .pulse-text { display: inline-block; animation: pulseText 3.2s ease-in-out infinite; will-change: transform, text-shadow; }
            `}</style>
            <DestinationTypewriter />
          <div className="autocomplete-container relative w-full">
            <input
              type="text"
              placeholder="Digita qui la tua meta"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                filterSuggestions(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
                    handleSuggestionClick(suggestions[highlightedIndex]);
                  } else {
                    const d = destination.trim();
                    if (!d) return;
                    const p: ItineraryParams = { destination: d, days, people, startDate: travelDates.startDate, endDate: travelDates.endDate };
                    onStart?.(p);
                  }
                } else {
                  handleKeyDown(e);
                }
              }}
              className="w-full bg-transparent px-4 md:px-6 py-3.5 md:py-3 text-white placeholder-slate-400 text-[clamp(.95rem,1.8vw,1rem)] focus:outline-none"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.name}
                    className={`px-4 py-2 cursor-pointer text-white hover:bg-white/10 transition-colors flex items-center gap-2 ${
                      index === highlightedIndex ? 'bg-white/20' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="text-lg">{suggestion.flag}</span>
                    <span>{suggestion.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
            <div className="flex flex-col items-center gap-3 md:gap-4 w-full">
              <div className="relative flex items-center bg-white/12 border border-white/20 rounded-full px-2 md:px-3 py-2 md:py-2.5 shadow-[0_0_16px_rgba(255,138,61,.14)] backdrop-blur-md w-full">
                <TravelDateSelector
                  onOpenChange={handleDatePickerOpenChange}
                  startDate={travelDates.startDate}
                  endDate={travelDates.endDate}
                />
              </div>
              <div className={`flex items-center justify-center bg-white/12 border border-white/20 rounded-full px-2 md:px-3 py-2 md:py-2.5 shadow-[0_0_16px_rgba(59,130,246,.14)] backdrop-blur-md ${pulsePeople ? 'ring-1 ring-brand-blue/60' : ''}`}>
                <button ref={peopleMinusRef} type="button" onClick={() => adjustPeople(-1)} aria-label="Riduci persone" disabled={people <= 1} className="stepper-btn stepper-people h-8 w-8 md:h-9 md:w-9 rounded-full">−</button>
                <Users className="ml-2 w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                <div className="flex items-center mx-1">
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={people}
                    readOnly
                    inputMode="numeric"
                    onKeyDown={(e) => e.preventDefault()}
                    onWheel={(e) => e.preventDefault()}
                    aria-label="Numero di persone"
                    className="w-10 md:w-12 bg-transparent rounded-full px-1 py-1 md:py-1.5 text-white placeholder-slate-400 focus:outline-none text-sm md:text-base text-center"
                    placeholder="2"
                  />
                  <span className="text-xs md:text-sm text-slate-300 ml-1">persone</span>
                </div>
                <button ref={peoplePlusRef} type="button" onClick={() => adjustPeople(1)} aria-label="Aumenta persone" disabled={people >= 8} className="stepper-btn stepper-people h-8 w-8 md:h-9 md:w-9 rounded-full">+</button>
              </div>
            </div>
            
            <button onClick={() => { const d = destination.trim(); if (!d) return; const p: ItineraryParams = { destination: d, days, people, startDate: travelDates.startDate, endDate: travelDates.endDate }; onStart?.(p); }} className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 md:hover:from-orange-600 md:hover:to-orange-700 text-white px-6 md:px-8 py-3.5 md:py-3 rounded-xl md:rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg md:shadow-none hover:shadow-orange-500/50 whitespace-nowrap mt-2">
              Genera il tuo viaggio
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-300">Potrai modificarlo subito insieme all’IA.</p>
          <a href="#examples" className="text-sm text-brand-orange hover:underline mt-2 inline-block">Guarda un itinerario di esempio</a>
        </div>

        <p className="text-slate-400 text-sm">
          Nessuna registrazione • Creato in pochi secondi • Sempre aggiornato
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-48 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>
  );
}
