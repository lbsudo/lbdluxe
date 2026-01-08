import { FaRegCopyright, FaRegEnvelope } from 'react-icons/fa'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { BriefcaseBusiness } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

export function Footer() {
  return (
    <>
      <footer className="w-full flex flex-col items-center justify-center py-6 mt-auto z-10">
        <div
          className={
            'h-px bg-linear-to-r from-transparent via-foreground to-transparent w-full mb-24 '
          }
        />

        <div
          className={
            'mb-12 md:mb-32 mt-0 flex w-full flex-col items-center justify-center'
          }
        >
          <Button
            className={
              'bg-foreground text-xl flex flex-row justify-center items-center text-background font-normal px-40  h-10'
            }
            variant="bar"
            onClick={() => {
              window.location.href = 'mailto:lbsudo100@gmail.com'
            }}
          >
            <FaRegEnvelope size={40} className={'size-5'} /> Email
          </Button>{' '}
          <span
            className={
              'text-neutral-400 text-md mt-4 flex select-none items-center justify-center gap-1 accent-neutral-500'
            }
          >
            <FaRegCopyright />
            {''} 2025 Lawrence Brown
          </span>
          <ul
            className={'flex flex-row justify-center items-center gap-4 pt-2'}
          >
            <li className={'flex justify-center items-center '}>
              <button
                className={'text-neutral-400'}
                onClick={() => window.open('https://currencycovenant.com')}
              >
                <BriefcaseBusiness size={20} className={'size-6'} />
              </button>
            </li>
            <li className={'flex justify-center items-center '}>
              <button
                className={'text-neutral-400'}
                onClick={() => window.open('https://github.com/lbsudo')}
              >
                <SiGithub size={20} className={'size-6'} />
              </button>
            </li>
            <li className={'flex justify-center items-center '}>
              <button
                className={'text-neutral-400'}
                onClick={() =>
                  window.open('https://linkedin.com/in/lbsudo', '_blank')
                }
              >
                <SiLinkedin size={20} className={'size-6'} />
              </button>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
