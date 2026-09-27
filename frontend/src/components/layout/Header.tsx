import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <div className="flex justify-between">
      <div>
        <p>title</p>
      </div>
      <div>
        <>
          {/*list of buttons goes here later - notifications, something else idk */}
        </>
        <Link className="text-sm" href="/account">
          name
        </Link>
      </div>
    </div>
  );
}
