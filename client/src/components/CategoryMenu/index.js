import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { idbPromise } from '../../utils/helpers';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { updateCurrentCategory, updateCurrentCategories, updateCategories } from '../../store/actions';

function CategoryMenu(props) {
    const { updateCurrentCategory, updateCurrentCategories, updateCategories } = props;
    const categories = useSelector((state) => state.categories);
    const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

    useEffect(() => {
        if (categoryData) {
            updateCurrentCategories(categoryData.categories);
            categoryData.categories.forEach((category) => {
                idbPromise('categories', 'put', category);
            });
        } else if (!loading) {
            idbPromise('categories', 'get').then((categories) => {
                updateCategories(categories);
            });
        }
    }, [categoryData, loading, updateCurrentCategories, updateCategories]);

    const handleClick = (id) => {
        updateCurrentCategory(id);
        <Link to={`/products/${id}`} />;
    };

    return (
        <div>
            <h2>Choose a Category:</h2>
            {categories &&
                categories.map((item) => (
                    <button
                        key={item._id}
                        onClick={() => {
                            handleClick(item._id);
                        }}
                    >
                        {item.name}
                    </button>
                ))}
        </div>
    );
}

const mapDispatchToProps = { updateCurrentCategory, updateCurrentCategories, updateCategories };
export default connect(null, mapDispatchToProps)(CategoryMenu);
