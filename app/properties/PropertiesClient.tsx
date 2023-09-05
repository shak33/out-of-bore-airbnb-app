"use client";

import { useState, useCallback } from 'react';
import { User, Listing } from '@prisma/client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

interface TripsClientProps {
  listings: Listing[];
  currentUser?: User | null;
}

import Container from '@/app/components/Container';
import Heading from '@/app/components/Heading';
import ListingCard from '@/app/components/listings/ListingCard';

const TripsClient = ({
  listings, currentUser,
} : TripsClientProps) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios
      .delete(`/api/listings/${id}`)
      .then(() => {
        toast.success('Listing deleted');
        router.refresh();
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        setDeletingId('');
      });
  }, [router]);

  return (
    <Container>
      <Heading
        title="Properties"
        subtitle="List of your properties"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grild-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={onCancel}
            disabled={deletingId === listing.id}
            actionLabel="Delete property"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default TripsClient;