import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter,FaFacebook,FaInstagram,FaTiktok} from 'react-icons/fa';

export default function Footer() {

  return (
    <footer className=" bg-white grid grid-cols-5 gap-4 w-full py-6 text-sm border-t-2 border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
        <Image src="/ESTC.png" alt="Logo" width={100} height={100} />
          
       </div>

      <div className="flex flex-col items-start space-y-3 text-lg">
        <h4 className="font-semibold ">About</h4>
        <Link href="#" className=" text-slate-500 hover:text-black ">
          Company
        </Link>
        <Link href="#" className="text-slate-500 hover:text-black" >
          Team
        </Link>
        <Link href="#" className="text-slate-500 hover:text-black">
          Careers
        </Link>
      </div>
      <div className="flex flex-col items-start space-y-3 text-lg">
        <h4 className="font-semibold">Cycles</h4>
        <Link href="#"  className="text-slate-500 hover:text-black">
                   Product Cycles
        </Link>
        <Link href="#"  className="text-slate-500 hover:text-black">
                    Release Cycle
        </Link>
        <Link href="#"  className="text-slate-500 hover:text-black">
          Roadmap
        </Link>
      </div>
      <div className="flex flex-col items-start space-y-3 text-lg ">
        <h4 className="font-semibold">Info</h4>
        <Link href="#"  className="text-slate-500 hover:text-black" >
          FAQ
        </Link>
        <Link href="#" className="text-slate-500 hover:text-black" >
          Documentation
        </Link>
        <Link href="#" className="text-slate-500 hover:text-black" >
          Support
        </Link>
      </div>
      <div className="flex flex-col items-start space-y-4 text-lg">
        <h4 className="font-semibold">Social</h4>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            
              <FaTwitter className="h-5 w-5" />
            
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            
              <FaFacebook className="h-5 w-5" />
           
          </Link>
          <Link href="#"  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          
              <FaInstagram className="h-5 w-5" />
            
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            
              <FaTiktok className="h-5 w-5" />
           
          </Link>
        </div>
      </div>
    </footer>
  );
}
