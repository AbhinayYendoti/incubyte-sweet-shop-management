import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSweets } from '@/contexts/SweetsContext';
import { Sweet } from '@/types';
import Header from '@/components/Header';
import AdminSweetForm from '@/components/AdminSweetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency';
import { DEFAULT_SWEET_IMAGE } from '@/lib/constants';
import { Plus, Pencil, Trash2, Package, IndianRupee, AlertTriangle, Loader2 } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { sweets, addSweet, updateSweet, deleteSweet, loading, error } = useSweets();
  const [formOpen, setFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [deletingSweet, setDeletingSweet] = useState<Sweet | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAdd = () => {
    setEditingSweet(null);
    setFormOpen(true);
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Sweet, 'id'>) => {
    if (editingSweet) {
      const result = await updateSweet(editingSweet.id, data);
      if (result.success) {
        toast({
          title: "Sweet updated! ✨",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        toast({
          title: "Update failed",
          description: result.error || "Failed to update sweet.",
          variant: "destructive",
        });
      }
    } else {
      const result = await addSweet(data);
      if (result.success) {
        toast({
          title: "Sweet added! 🎉",
          description: `${data.name} has been added to the catalog.`,
        });
      } else {
        toast({
          title: "Add failed",
          description: result.error || "Failed to add sweet.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (deletingSweet) {
      const result = await deleteSweet(deletingSweet.id);
      if (result.success) {
        toast({
          title: "Sweet deleted",
          description: `${deletingSweet.name} has been removed from the catalog.`,
        });
        setDeletingSweet(null);
      } else {
        toast({
          title: "Delete failed",
          description: result.error || "Failed to delete sweet.",
          variant: "destructive",
        });
      }
    }
  };

  // Only count quantity if it's explicitly set (not undefined)
  const totalStock = sweets.reduce((sum, s) => sum + (s.quantity ?? 0), 0);
  const outOfStock = sweets.filter(s => s.quantity !== undefined && s.quantity === 0).length;
  const totalValue = sweets.reduce((sum, s) => sum + (s.price * (s.quantity ?? 0)), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your sweet inventory
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Sweet
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{sweets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatPrice(totalValue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Out of Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">{outOfStock}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
            <p className="font-medium">Error loading sweets</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Loading sweets...</p>
              </div>
            ) : sweets.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Package className="w-8 h-8 mx-auto mb-2" />
                <p>No sweets found. Add your first sweet!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sweet</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sweets.map(sweet => (
                    <TableRow key={sweet.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={sweet.image || DEFAULT_SWEET_IMAGE} 
                            alt={sweet.name || 'Sweet item'}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{sweet.name}</p>
                            {sweet.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {sweet.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {sweet.category || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(sweet.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {sweet.quantity !== undefined ? (
                          <Badge variant={sweet.quantity === 0 ? 'destructive' : 'outline'}>
                            {sweet.quantity}
                          </Badge>
                        ) : (
                          <Badge variant="outline">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(sweet)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingSweet(sweet)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
      
      <AdminSweetForm
        open={formOpen}
        onOpenChange={setFormOpen}
        sweet={editingSweet}
        onSubmit={handleSubmit}
      />
      
      <AlertDialog open={!!deletingSweet} onOpenChange={() => setDeletingSweet(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sweet?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSweet?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
