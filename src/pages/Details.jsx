import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductDetail from '../components/ProductDetail';
import ProductDetailErrorBoundary from '../components/ProductDetailErrorBoundary';

export default function Details() {
  return (
    <div className="productdetail-page min-h-screen bg-royalty-nude flex flex-col font-sans selection:bg-royalty-yellow/30 selection:text-royalty-purple">
      <Header />
      <main className="flex-grow">
        <ProductDetailErrorBoundary>
          <ProductDetail />
        </ProductDetailErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
