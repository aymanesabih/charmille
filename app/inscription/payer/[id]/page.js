"use client";
// pages/inscription/payer/[id]/index.js
import { Payer } from '../payer';

export default function PayerPage({params}) {

    return <Payer id={params.id} />;
}
