'use client' 


import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function NavBar() {
    const [currentHash, setCurrentHash] = useState<string>('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentHash(window.location.hash)
        }
        
        // Set initial hash
        setCurrentHash(window.location.hash)
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange)
        
        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [])

    const links = [
        { name: 'welcome', path: '/#welcome' },
        { name: 'about me', path: '/#about' },
        { name: 'skills', path: '/#skills' },
        { name: 'projects', path: '/#projects' },
        { name: 'contact', path: '/#contact' }
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-background z-10">
            <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-center">

                <div className="hidden md:flex space-x-8">
                    {links.map((link) => (
                        <Link 
                            key={link.path} 
                            href={link.path}
                            className={`text-sm font-medium capitalize transition-colors ${
                                (link.path === '/#welcome' && (currentHash === '' || currentHash === '#welcome')) ||
                                (link.path.startsWith('/#') && currentHash === link.path.substring(1))
                                    ? 'text-foreground' 
                                    : 'text-green-200 hover:text-blue-500'
                            }`}
                        >   
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="md:hidden flex w-full justify-between items-center">
                    <div className="font-bold text-xl">Portfolio</div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t shadow-md">
                    <div className="flex flex-col items-center py-4">
                        {links.map((link) => (
                                                    <Link 
                            key={link.path} 
                            href={link.path}
                            className={`py-3 text-lg font-medium capitalize ${
                                (link.path === '/#welcome' && (currentHash === '' || currentHash === '#welcome')) ||
                                (link.path.startsWith('/#') && currentHash === link.path.substring(1))
                                    ? 'text-blue-600' 
                                    : 'text-gray-700'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
