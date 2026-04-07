import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/common/Card';
import { Wrench } from 'lucide-react';

export default function PlaceholderPage({ title, description }) {
  return (
    <PageWrapper>
      <Card className="p-12 text-center max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
          <Wrench size={28} className="text-[var(--text-tertiary)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title || 'Coming Soon'}</h2>
        <p className="text-sm text-[var(--text-secondary)]">{description || 'This page is under development and will be available soon.'}</p>
      </Card>
    </PageWrapper>
  );
}
