import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Truck, Heart } from 'lucide-react';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-pattern-mandala">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 text-sm font-medium mb-6 animate-float">
              <span className="text-lg">🪔</span>
              Traditional Indian Sweets Since 1965
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Experience the Magic of
              <span className="block text-gradient-gold">Authentic Indian Mithai</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              From the rich Kaju Katli of Punjab to the spongy Rasgullas of Bengal, 
              discover handcrafted sweets made with pure ghee, premium dry fruits, 
              and generations of expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base px-8 shadow-lg hover:shadow-xl transition-shadow">
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Star, title: 'Premium Quality', desc: 'Made with pure ghee & saffron' },
              { icon: Shield, title: '100% Fresh', desc: 'Prepared fresh daily' },
              { icon: Truck, title: 'Pan India Delivery', desc: 'Delivered to your doorstep' },
              { icon: Heart, title: 'Made with Love', desc: 'Traditional family recipes' }
            ].map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-accent p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-pattern-mandala opacity-10" />
            <div className="relative">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Ready to taste the tradition?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Join thousands of happy customers who trust us for their festive celebrations, 
                special occasions, and everyday indulgence.
              </p>
              <Link to="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 मिठाई Palace. Spreading sweetness across India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;